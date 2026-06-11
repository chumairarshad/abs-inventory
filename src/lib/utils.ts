// ─── Types ────────────────────────────────────────────────────────────────────

export interface Project {
  id: string
  name: string
  location: string
  type: 'commercial' | 'residential'
  color: string
  sheetUrl: string
}

export interface Unit {
  floor: string
  unitNo: string
  category: string
  area: string
  status: string
  statusClass: UnitStatus
  raw: string[]
}

export type UnitStatus = 'available' | 'sold' | 'booked' | 'nfs'

// ─── Status labels (edit here to add synonyms) ────────────────────────────────

const STATUS = {
  available:  ['AVAILABLE', 'AVAIL'],
  sold:       ['SOLD', 'TOKEN PAID', 'TOKEN'],
  booked:     ['BOOKED', 'BOOK', 'RESERVED'],
  notForSale: ['NOT FOR SALE', 'NFS', 'HOLD', 'DISPLAY'],
}

export function getStatusClass(raw: string): UnitStatus {
  const s = (raw ?? '').toUpperCase().trim()
  if (STATUS.available.includes(s))               return 'available'
  if (STATUS.sold.includes(s))                    return 'sold'
  if (STATUS.booked.some(b => s.includes(b)))     return 'booked'
  if (STATUS.notForSale.some(n => s.includes(n))) return 'nfs'
  return 'nfs'
}

// ─── RFC-4180 CSV parser (handles CRLF + quoted fields) ──────────────────────

function splitCSVLine(line: string): string[] {
  const cols: string[] = []
  let cur = '', inQ = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++ }
      else inQ = !inQ
    } else if (ch === ',' && !inQ) {
      cols.push(cur); cur = ''
    } else {
      cur += ch
    }
  }
  cols.push(cur)
  return cols
}

export function parseCSV(text: string): string[][] {
  // Normalise Windows (CRLF) and old-Mac (CR) line endings
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')
  const rows: string[][] = []
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    const cols = splitCSVLine(trimmed)
    if (cols.length < 5) continue
    rows.push(cols.map(c => c.trim()))
  }
  return rows
}

// ─── Fetch Google Sheet CSV via server-side API route (no CORS issues) ───────

export async function fetchSheet(url: string): Promise<string[][]> {
  const apiUrl = `/api/sheet?url=${encodeURIComponent(url)}`
  const resp = await fetch(apiUrl, { cache: 'no-store' })
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: `HTTP ${resp.status}` }))
    throw new Error(err.error ?? `HTTP ${resp.status}`)
  }
  const text = await resp.text()
  const rows = parseCSV(text)
  if (rows.length < 2) throw new Error('Sheet has < 2 rows — check CSV export URL & sharing')
  return rows
}

// ─── Parse rows into Unit objects ─────────────────────────────────────────────
// Expected columns (0-indexed):  0=Floor  1=UnitNo  2=Category  3=Area  4=Status
// (header row is rows[0], data starts at rows[1])

export function parseUnits(rows: string[][]): Unit[] {
  return rows.slice(1).map(cols => ({
    floor:       cols[0] ?? '',
    unitNo:      cols[1] ?? '',
    category:    cols[2] ?? '',
    area:        cols[3] ?? '',
    status:      cols[4] ?? '',
    statusClass: getStatusClass(cols[4]),
    raw:         cols,
  }))
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

const STORAGE_KEY = 'abs_projects'

export function loadProjects(): Project[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Project[]
  } catch {
    return []
  }
}

export function saveProjects(projects: Project[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
}
