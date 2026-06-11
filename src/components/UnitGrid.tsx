'use client'
import { useState } from 'react'
import { Unit } from '@/lib/utils'

// ─── Wooden Door SVG ──────────────────────────────────────────────────────────
function Door({ unit }: { unit: Unit }) {
  const [showTip, setShowTip] = useState(false)
  const [tipPos, setTipPos]   = useState({ x: 0, y: 0 })
  const s = unit.statusClass

  const frameColor = { available: '#16A34A', sold: '#DC2626', booked: '#D97706', nfs: '#9CA3AF' }[s]
  const stripColor = { available: '#15803D', sold: '#B91C1C', booked: '#B45309', nfs: '#6B7280' }[s]
  const badgeColor = { available: '#22C55E', sold: '#EF4444', booked: '#F59E0B', nfs: '#9CA3AF' }[s]
  const label      = { available: 'AVAILABLE', sold: 'SOLD', booked: 'BOOKED', nfs: 'NOT FOR SALE' }[s]

  return (
    <div
      className="relative cursor-default select-none"
      style={{ width: 100, height: 148 }}
      onMouseMove={e => setTipPos({ x: e.clientX + 14, y: e.clientY - 12 })}
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
    >
      <svg width="100" height="148" viewBox="0 0 100 148">
        <defs>
          <linearGradient id={`wood-${s}-a`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#8B5E3C"/>
            <stop offset="22%"  stopColor="#A0703F"/>
            <stop offset="42%"  stopColor="#7A5230"/>
            <stop offset="65%"  stopColor="#9B6A3A"/>
            <stop offset="85%"  stopColor="#7C5228"/>
            <stop offset="100%" stopColor="#8B5E3C"/>
          </linearGradient>
          <linearGradient id={`wood-${s}-b`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#6B4226"/>
            <stop offset="30%"  stopColor="#8B5E3C"/>
            <stop offset="60%"  stopColor="#6B4226"/>
            <stop offset="100%" stopColor="#7A5230"/>
          </linearGradient>
          <linearGradient id={`wood-${s}-c`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#5C3A1E"/>
            <stop offset="40%"  stopColor="#7A5230"/>
            <stop offset="70%"  stopColor="#5C3A1E"/>
            <stop offset="100%" stopColor="#6B4226"/>
          </linearGradient>
          <linearGradient id={`knob-${s}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#F5D060"/>
            <stop offset="100%" stopColor="#B8860B"/>
          </linearGradient>
        </defs>

        {/* Outer frame */}
        <rect x="0" y="0" width="100" height="134" rx="4" fill={frameColor}/>

        {/* ── SOLD: ajar gap ── */}
        {s === 'sold' && <rect x="6" y="6" width="16" height="122" rx="0" fill="#1A0A00" opacity="0.65"/>}
        {/* ── BOOKED: ajar gap ── */}
        {s === 'booked' && <rect x="6" y="6" width="12" height="122" rx="0" fill="#1A0A00" opacity="0.55"/>}

        {/* Door body */}
        <rect
          x={s === 'sold' ? 22 : s === 'booked' ? 18 : 6}
          y="6"
          width={s === 'sold' ? 72 : s === 'booked' ? 76 : 88}
          height="122"
          rx="2"
          fill={s === 'nfs' ? `url(#wood-${s}-c)` : s === 'sold' ? `url(#wood-${s}-b)` : `url(#wood-${s}-a)`}
        />

        {/* Wood grain lines */}
        {[18, 34, 50, 66, 80].map(x => (
          <line key={x} x1={x} y1="6" x2={x} y2="128"
            stroke={s === 'sold' ? '#4A2C10' : '#6B4226'}
            strokeWidth="0.7" opacity="0.45"/>
        ))}

        {/* Top panel */}
        <rect
          x={s === 'sold' ? 27 : s === 'booked' ? 22 : 12}
          y="14"
          width={s === 'sold' || s === 'booked' ? 62 : 76}
          height="44"
          rx="2"
          fill={s === 'nfs' ? '#4A2C10' : '#7A5230'}
          stroke="#5C3A1E" strokeWidth="0.8" opacity="0.82"
        />

        {/* Bottom panel */}
        <rect
          x={s === 'sold' ? 27 : s === 'booked' ? 22 : 12}
          y="66"
          width={s === 'sold' || s === 'booked' ? 62 : 76}
          height="50"
          rx="2"
          fill={s === 'nfs' ? '#4A2C10' : '#7A5230'}
          stroke="#5C3A1E" strokeWidth="0.8" opacity="0.82"
        />

        {/* Knob */}
        <circle
          cx={s === 'sold' || s === 'booked' ? 26 : 82}
          cy="74"
          r="5"
          fill={s === 'nfs' ? '#9CA3AF' : `url(#knob-${s})`}
          stroke="#8B6914" strokeWidth="0.7"
        />
        <circle
          cx={s === 'sold' || s === 'booked' ? 26 : 82}
          cy="74"
          r="2"
          fill={s === 'nfs' ? '#D1D5DB' : '#F5D060'}
          opacity="0.65"
        />

        {/* Unit number badge */}
        <rect
          x={s === 'sold' ? 30 : s === 'booked' ? 25 : 14}
          y="22"
          width={s === 'sold' || s === 'booked' ? 56 : 72}
          height="20"
          rx="2"
          fill={badgeColor}
        />
        <text
          x={s === 'sold' ? 58 : s === 'booked' ? 53 : 50}
          y="35"
          textAnchor="middle"
          fontFamily="sans-serif"
          fontSize="9"
          fontWeight="700"
          fill="#fff"
        >
          {unit.unitNo}
        </text>

        {/* Company nameplate */}
        <rect
          x={s === 'sold' ? 27 : s === 'booked' ? 22 : 12}
          y="84"
          width={s === 'sold' || s === 'booked' ? 62 : 76}
          height="16"
          rx="2"
          fill="#FEF9F0"
          opacity="0.95"
        />
        <text
          x={s === 'sold' ? 58 : s === 'booked' ? 53 : 50}
          y="95"
          textAnchor="middle"
          fontFamily="sans-serif"
          fontSize="6"
          fontWeight="700"
          fill="#5C3A1E"
        >
          ABS DEVELOPERS
        </text>

        {/* Chain for sold */}
        {s === 'sold' && (
          <>
            <path d="M24 62 Q34 57 44 63 Q54 69 64 62 Q74 55 84 61"
              fill="none" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round"/>
            <rect x="44" y="59" width="14" height="10" rx="2" fill="#6B7280" stroke="#374151" strokeWidth="0.8"/>
            <path d="M47,59 Q47,53 51,53 Q55,53 55,59"
              fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="51" cy="65" r="2" fill="#374151"/>
          </>
        )}

        {/* Keyhole for nfs */}
        {s === 'nfs' && (
          <>
            <rect x="12" y="66" width="12" height="7" rx="1" fill="#6B7280"/>
            <rect x="10" y="68" width="5" height="4" rx="1" fill="#4B5563"/>
            <circle cx="50" cy="68" r="5" fill="#3A2410" stroke="#2D1A0A" strokeWidth="0.8"/>
            <rect x="47.5" y="68" width="5" height="7" rx="1" fill="#3A2410" stroke="#2D1A0A" strokeWidth="0.4"/>
          </>
        )}

        {/* Area text */}
        <text
          x={s === 'sold' ? 58 : s === 'booked' ? 53 : 50}
          y="110"
          textAnchor="middle"
          fontFamily="sans-serif"
          fontSize="7"
          fill="#8B5E3C"
          opacity="0.9"
        >
          {unit.area}
        </text>

        {/* Status strip */}
        <rect x="0" y="122" width="100" height="12" rx="2" fill={stripColor}/>
        <text x="50" y="131" textAnchor="middle" fontFamily="sans-serif"
          fontSize="6.5" fontWeight="700" fill="#fff" letterSpacing="0.6">
          {label}
        </text>
      </svg>

      {/* Tooltip */}
      {showTip && (
        <div
          className="fixed z-50 bg-gray-900 text-white rounded-lg px-3 py-2 text-xs pointer-events-none shadow-2xl whitespace-nowrap"
          style={{ left: tipPos.x, top: tipPos.y }}
        >
          <div className="font-bold text-[13px] mb-0.5">Unit {unit.unitNo}</div>
          {unit.category && <div className="text-white/60 text-[11px]">{unit.category}</div>}
          {unit.area     && <div className="text-white/60 text-[11px]">{unit.area} sq ft</div>}
          {unit.floor    && <div className="text-white/60 text-[11px]">Floor: {unit.floor}</div>}
          <div className="mt-1 text-[10px] font-bold" style={{ color: badgeColor }}>
            {unit.status || label}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Group by area size ───────────────────────────────────────────────────────
interface Props { units: Unit[] }

export default function UnitGrid({ units }: Props) {
  if (units.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
        <svg className="w-9 h-9 opacity-35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <p className="text-sm font-medium">No units match the current filters</p>
      </div>
    )
  }

  // Group by floor first, then by area within each floor
  const byFloor: Record<string, Unit[]> = {}
  for (const u of units) {
    const key = u.floor || 'Unknown Floor'
    if (!byFloor[key]) byFloor[key] = []
    byFloor[key].push(u)
  }

  return (
    <div>
      {Object.entries(byFloor).map(([floorName, floorUnits]) => {
        // Group by area within floor
        const byArea: Record<string, Unit[]> = {}
        for (const u of floorUnits) {
          const aKey = u.area || 'N/A'
          if (!byArea[aKey]) byArea[aKey] = []
          byArea[aKey].push(u)
        }

        const totalA = floorUnits.filter(u => u.statusClass === 'available').length
        const totalS = floorUnits.filter(u => u.statusClass === 'sold').length
        const totalB = floorUnits.filter(u => u.statusClass === 'booked').length

        return (
          <div key={floorName} className="mb-8">
            {/* Floor header */}
            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {floorName}
              </span>
              <span className="text-xs text-gray-300">·</span>
              {totalA > 0 && <span className="text-xs font-semibold text-[#15803D]">{totalA} avail</span>}
              {totalS > 0 && <span className="text-xs font-semibold text-[#B91C1C]">{totalS} sold</span>}
              {totalB > 0 && <span className="text-xs font-semibold text-[#92400E]">{totalB} booked</span>}
              <div className="flex-1 border-t border-black/8"/>
            </div>

            {/* Area sub-groups */}
            {Object.entries(byArea)
              .sort(([a], [b]) => parseFloat(a) - parseFloat(b))
              .map(([area, areaUnits]) => {
                const av = areaUnits.filter(u => u.statusClass === 'available').length
                const sv = areaUnits.filter(u => u.statusClass === 'sold').length
                const bv = areaUnits.filter(u => u.statusClass === 'booked').length
                const nv = areaUnits.filter(u => u.statusClass === 'nfs').length
                return (
                  <div key={area} className="mb-5">
                    {/* Area size pill + counts */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                        {area} sq ft
                        <span className="text-amber-500 font-normal">· {areaUnits.length} units</span>
                      </span>
                      {av > 0 && <span className="text-[11px] font-medium text-[#15803D] bg-green-50 px-2 py-0.5 rounded-full border border-green-200">{av} available</span>}
                      {sv > 0 && <span className="text-[11px] font-medium text-[#B91C1C] bg-red-50 px-2 py-0.5 rounded-full border border-red-200">{sv} sold</span>}
                      {bv > 0 && <span className="text-[11px] font-medium text-[#92400E] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">{bv} booked</span>}
                      {nv > 0 && <span className="text-[11px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200">{nv} nfs</span>}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {areaUnits.map((u, i) => <Door key={`${u.unitNo}-${i}`} unit={u}/>)}
                    </div>
                  </div>
                )
              })}
          </div>
        )
      })}
    </div>
  )
}
