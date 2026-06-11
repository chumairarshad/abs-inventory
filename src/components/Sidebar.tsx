'use client'
import { useState } from 'react'
import { Project } from '@/lib/utils'

interface Props {
  projects:  Project[]
  currentId: string | null
  onSelect:  (id: string) => void
  onManage:  () => void
}

export default function Sidebar({ projects, currentId, onSelect, onManage }: Props) {
  const [open, setOpen] = useState(false)

  const inner = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-black/8 flex items-center justify-between">
        <div>
          <div className="text-sm font-bold tracking-wide uppercase">
            ABS <span className="text-[#FF6B00]">Inventory</span>
          </div>
          <div className="text-xs text-gray-400 mt-0.5">All Projects</div>
        </div>
        {/* Close button — mobile only */}
        <button
          className="md:hidden w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100"
          onClick={() => setOpen(false)}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div className="px-4 pt-3.5 pb-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
        Projects
      </div>

      <div className="flex-1 overflow-y-auto">
        {projects.length === 0 && (
          <p className="px-4 py-3 text-xs text-gray-400">No projects yet</p>
        )}
        {projects.map(p => (
          <button
            key={p.id}
            onClick={() => { onSelect(p.id); setOpen(false) }}
            className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-left transition-all border-l-[3px] text-sm ${
              currentId === p.id
                ? 'bg-[#FFF0E5] border-l-[#FF6B00] text-gray-800'
                : 'border-l-transparent text-gray-500 hover:bg-[#FFF0E5] hover:text-gray-800 hover:border-l-[rgba(255,107,0,0.3)]'
            }`}
          >
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color || '#FF6B00' }} />
            <span className="flex-1 min-w-0">
              <span className="block font-semibold text-gray-800 truncate">{p.name}</span>
              {p.location && <span className="block text-[11px] text-gray-400 truncate">{p.location}</span>}
            </span>
            <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded flex-shrink-0 ${
              p.type === 'commercial' ? 'bg-[#FFF0E5] text-[#FF6B00]' : 'bg-indigo-50 text-indigo-600'
            }`}>
              {p.type === 'commercial' ? 'COM' : 'Res'}
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={() => { onManage(); setOpen(false) }}
        className="flex items-center gap-2 mx-3 my-2.5 px-3 py-2 text-xs text-gray-400 border border-dashed border-black/14 rounded-lg hover:border-[#FF6B00] hover:text-[#FF6B00] hover:bg-[#FFF0E5] transition-all"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Add / Manage Projects
      </button>
    </div>
  )

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex w-60 flex-shrink-0 bg-white border-r border-black/8 flex-col sticky top-0 h-screen overflow-y-auto">
        {inner}
      </aside>

      {/* ── Mobile hamburger button ── */}
      <button
        className="md:hidden fixed top-3 left-3 z-40 w-9 h-9 flex items-center justify-center bg-white border border-black/14 rounded-lg shadow-sm"
        onClick={() => setOpen(true)}
      >
        <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M3 6h18M3 12h18M3 18h18"/>
        </svg>
      </button>

      {/* ── Mobile drawer overlay ── */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="relative w-72 bg-white h-full flex flex-col shadow-2xl z-10">
            {inner}
          </aside>
        </div>
      )}
    </>
  )
}
