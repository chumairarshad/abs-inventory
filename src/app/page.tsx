'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Project, Unit, UnitStatus,
  fetchSheet, parseUnits,
  loadProjects, saveProjects,
} from '@/lib/utils'
import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import StatsStrip from '@/components/StatsStrip'
import UnitGrid from '@/components/UnitGrid'
import ManageModal from '@/components/ManageModal'
import Toast from '@/components/Toast'

export default function Home() {
  const [projects, setProjects]         = useState<Project[]>([])
  const [currentId, setCurrentId]       = useState<string | null>(null)
  const [units, setUnits]               = useState<Unit[]>([])
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState<string | null>(null)
  const [floor, setFloor]               = useState<string>('all')
  const [catFilter, setCatFilter]       = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [modalOpen, setModalOpen]       = useState(false)
  const [updatedAt, setUpdatedAt]       = useState<string>('')
  const [toast, setToast]               = useState('')
  const cache = useRef<Record<string, Unit[]>>({})

  useEffect(() => { setProjects(loadProjects()) }, [])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const loadProject = useCallback(async (project: Project, bust = false) => {
    if (!bust && cache.current[project.id]) {
      setUnits(cache.current[project.id])
      setFloor('all'); setCatFilter('all'); setStatusFilter('all')
      return
    }
    setLoading(true); setError(null); setUnits([])
    try {
      const rows   = await fetchSheet(project.sheetUrl)
      const parsed = parseUnits(rows)
      cache.current[project.id] = parsed
      setUnits(parsed)
      setFloor('all'); setCatFilter('all'); setStatusFilter('all')
      setUpdatedAt(new Date().toLocaleTimeString())
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  const selectProject = (id: string) => {
    setCurrentId(id)
    const p = projects.find(p => p.id === id)
    if (p) loadProject(p)
  }

  const refresh = () => {
    const p = projects.find(p => p.id === currentId)
    if (p) { delete cache.current[p.id]; loadProject(p, true) }
  }

  const handleSaveProjects = (updated: Project[]) => {
    setProjects(updated); saveProjects(updated)
    cache.current = {}
    showToast('Projects saved')
    setModalOpen(false)
  }

  const currentProject = projects.find(p => p.id === currentId) ?? null
  const floors     = ['all', ...Array.from(new Set(units.map(u => u.floor))).filter(Boolean).sort()]
  const categories = ['all', ...Array.from(new Set(units.map(u => u.category))).filter(Boolean).sort()]

  const filtered = units.filter(u => {
    if (floor !== 'all' && u.floor !== floor)                     return false
    if (catFilter !== 'all' && u.category !== catFilter)          return false
    if (statusFilter !== 'all' && u.statusClass !== statusFilter) return false
    return true
  })

  const stats = {
    total:  units.length,
    avail:  units.filter(u => u.statusClass === 'available').length,
    sold:   units.filter(u => u.statusClass === 'sold').length,
    booked: units.filter(u => u.statusClass === 'booked').length,
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar projects={projects} currentId={currentId} onSelect={selectProject} onManage={() => setModalOpen(true)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar project={currentProject} updatedAt={updatedAt} loading={loading} onRefresh={refresh} onManage={() => setModalOpen(true)} />

        <StatsStrip stats={stats} />

        {/* Filters */}
        <div className="bg-white border-b border-black/8 px-3 md:px-6 py-2.5 flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-wrap">
          {/* Floor tabs — scrollable on mobile */}
          <div className="flex gap-1.5 flex-nowrap overflow-x-auto pb-0.5 flex-1 w-full sm:w-auto scrollbar-hide">
            {floors.map(f => (
              <button
                key={f}
                onClick={() => setFloor(f)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all whitespace-nowrap flex-shrink-0 ${
                  floor === f
                    ? 'bg-[#FF6B00] text-white border-transparent font-semibold'
                    : 'border-black/14 text-gray-500 hover:border-[#FF6B00] hover:text-gray-800'
                }`}
              >
                {f === 'all' ? 'All Floors' : f}
              </button>
            ))}
          </div>
          {/* Category + Status — side by side on mobile */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 font-medium">Cat</span>
              <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
                className="text-xs border border-black/14 rounded-md px-2 py-1 bg-white outline-none focus:border-[#FF6B00]">
                {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All' : c}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 font-medium">Status</span>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as UnitStatus | 'all')}
                className="text-xs border border-black/14 rounded-md px-2 py-1 bg-white outline-none focus:border-[#FF6B00]">
                <option value="all">All</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="booked">Booked</option>
                <option value="nfs">Not for Sale</option>
              </select>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-gray-50 border-b border-black/8 px-3 md:px-6 py-2 flex gap-3 flex-wrap">
          {[
            { color: '#22C55E', label: 'Available' },
            { color: '#EF4444', label: 'Sold' },
            { color: '#F59E0B', label: 'Booked' },
            { color: '#ccc',    label: 'NFS', border: '#bbb' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{ background: l.color, border: l.border ? `1px solid ${l.border}` : undefined }} />
              {l.label}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="p-3 md:p-6 flex-1">
          {!currentId && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
              <svg className="w-9 h-9 opacity-35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
              <p className="text-sm font-medium text-center">Select a project from the sidebar</p>
              {projects.length === 0 && (
                <p className="text-xs text-gray-400 text-center">
                  No projects yet —{' '}
                  <button className="text-[#FF6B00] underline" onClick={() => setModalOpen(true)}>add one</button>
                </p>
              )}
            </div>
          )}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
              <div className="w-8 h-8 border-2 border-[#FF6B00] border-t-transparent rounded-full spinning" />
              <p className="text-sm font-medium">Loading sheet data…</p>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
              <strong>Failed to load sheet:</strong> {error}
              <p className="mt-1 text-xs text-red-500">Check that the Sheet is shared publicly and the URL is a CSV export link.</p>
            </div>
          )}
          {!loading && !error && currentId && <UnitGrid units={filtered} />}
        </div>
      </div>

      {modalOpen && (
        <ManageModal projects={projects} onSave={handleSaveProjects} onClose={() => setModalOpen(false)} />
      )}
      <Toast message={toast} />
    </div>
  )
}
