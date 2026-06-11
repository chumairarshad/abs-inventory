'use client'
import { Project } from '@/lib/utils'

interface Props {
  project:   Project | null
  updatedAt: string
  loading:   boolean
  onRefresh: () => void
  onManage:  () => void
}

export default function Topbar({ project, updatedAt, loading, onRefresh, onManage }: Props) {
  return (
    <div className="bg-white border-b border-black/8 px-4 md:px-6 py-3 flex items-center justify-between gap-2 sticky top-0 z-10">
      {/* Left — project info (shifted right on mobile to make room for hamburger) */}
      <div className="flex items-center gap-2 min-w-0 ml-10 md:ml-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[14px] md:text-[15px] font-bold text-gray-800 truncate">
              {project?.name ?? 'Select a project'}
            </span>
            {project && (
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 ${
                project.type === 'commercial' ? 'bg-[#FFF0E5] text-[#FF6B00]' : 'bg-indigo-50 text-indigo-600'
              }`}>
                {project.type}
              </span>
            )}
          </div>
          <div className="text-xs text-gray-400 truncate">{project?.location ?? '—'}</div>
        </div>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {updatedAt && (
          <span className="hidden sm:block text-xs text-gray-400 mr-1">Updated {updatedAt}</span>
        )}
        <button
          onClick={onRefresh}
          disabled={!project || loading}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium border border-black/14 rounded-lg bg-white text-gray-700 hover:bg-[#FFF0E5] hover:border-[#FF6B00] hover:text-[#FF6B00] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg className={`w-3 h-3 ${loading ? 'spinning' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
          </svg>
          <span className="hidden sm:inline">Refresh</span>
        </button>
        <button
          onClick={onManage}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-[#FF6B00] border border-[#CC5500] text-white rounded-lg hover:bg-[#CC5500] transition-all"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
          <span className="hidden sm:inline">Manage</span>
        </button>
      </div>
    </div>
  )
}
