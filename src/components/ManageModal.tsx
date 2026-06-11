'use client'
import { useState } from 'react'
import { Project } from '@/lib/utils'

interface Props {
  projects: Project[]
  onSave:   (projects: Project[]) => void
  onClose:  () => void
}

const EMPTY: Omit<Project, 'id'> = {
  name: '', location: '', type: 'commercial', color: '#FF6B00', sheetUrl: '',
}

export default function ManageModal({ projects, onSave, onClose }: Props) {
  const [list, setList]       = useState<Project[]>(projects)
  const [form, setForm]       = useState({ ...EMPTY })
  const [formErr, setFormErr] = useState('')
  const [editId, setEditId]   = useState<string | null>(null)

  const update = (id: string, field: keyof Project, val: string) =>
    setList(prev => prev.map(p => p.id === id ? { ...p, [field]: val } : p))

  const remove = (id: string) => setList(prev => prev.filter(p => p.id !== id))

  const add = () => {
    setFormErr('')
    if (!form.name.trim())     { setFormErr('Project name is required.');        return }
    if (!form.sheetUrl.trim()) { setFormErr('Google Sheet CSV URL is required.'); return }
    setList(prev => [...prev, { ...form, id: 'p' + Date.now() }])
    setForm({ ...EMPTY })
  }

  return (
    <div
      className="fixed inset-0 bg-black/45 z-50 flex items-end sm:items-center justify-center sm:p-5 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/8 sticky top-0 bg-white z-10">
          <h2 className="text-base font-bold">Manage Projects</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="p-5">

          {/* Existing projects — card list on mobile, table on desktop */}
          {list.length > 0 ? (
            <div className="mb-5 space-y-2.5">
              {list.map(p => (
                <div key={p.id} className="border border-black/10 rounded-xl overflow-hidden">
                  {/* Project card header */}
                  <div
                    className="flex items-center justify-between px-3.5 py-2.5 bg-gray-50 cursor-pointer"
                    onClick={() => setEditId(editId === p.id ? null : p.id)}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.color }}/>
                      <span className="text-sm font-semibold text-gray-800 truncate">{p.name}</span>
                      {p.location && <span className="text-xs text-gray-400 truncate hidden sm:block">{p.location}</span>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        p.type === 'commercial' ? 'bg-[#FFF0E5] text-[#FF6B00]' : 'bg-indigo-50 text-indigo-600'
                      }`}>{p.type === 'commercial' ? 'COM' : 'RES'}</span>
                      <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${editId === p.id ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>
                    </div>
                  </div>

                  {/* Expanded edit fields */}
                  {editId === p.id && (
                    <div className="px-3.5 py-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 border-t border-black/8">
                      {[
                        { label: 'Project Name', field: 'name' as keyof Project,     ph: 'e.g. Crown Heights' },
                        { label: 'Location',     field: 'location' as keyof Project, ph: 'e.g. DHA Lahore' },
                      ].map(({ label, field, ph }) => (
                        <div key={field} className="flex flex-col gap-1">
                          <label className="text-[11px] font-semibold text-gray-400">{label}</label>
                          <input
                            className="px-2.5 py-1.5 border border-black/14 rounded-md text-xs outline-none focus:border-[#FF6B00] bg-white"
                            value={p[field] as string}
                            placeholder={ph}
                            onChange={e => update(p.id, field, e.target.value)}
                          />
                        </div>
                      ))}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-semibold text-gray-400">Type</label>
                        <select
                          className="px-2.5 py-1.5 border border-black/14 rounded-md text-xs outline-none focus:border-[#FF6B00] bg-white"
                          value={p.type}
                          onChange={e => update(p.id, 'type', e.target.value)}
                        >
                          <option value="commercial">Commercial</option>
                          <option value="residential">Residential</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-semibold text-gray-400">Accent Color</label>
                        <input type="color" value={p.color} onChange={e => update(p.id, 'color', e.target.value)}
                          className="h-8 w-full rounded-md border border-black/14 cursor-pointer"/>
                      </div>
                      <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
                        <label className="text-[11px] font-semibold text-gray-400">Google Sheet CSV URL</label>
                        <input
                          className="px-2.5 py-1.5 border border-black/14 rounded-md text-xs outline-none focus:border-[#FF6B00] bg-white"
                          value={p.sheetUrl}
                          placeholder="https://docs.google.com/spreadsheets/d/…/export?format=csv&gid=0"
                          onChange={e => update(p.id, 'sheetUrl', e.target.value)}
                        />
                      </div>
                      <div className="col-span-1 sm:col-span-2 flex justify-end">
                        <button
                          onClick={() => remove(p.id)}
                          className="px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-semibold hover:bg-red-100 transition-all"
                        >
                          Remove Project
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 mb-5">No projects yet. Add one below.</p>
          )}

          {/* Add new project */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-bold mb-3">Add New Project</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Project Name *', field: 'name',     ph: 'e.g. Crown Heights' },
                { label: 'Location',       field: 'location', ph: 'e.g. DHA Lahore' },
              ].map(({ label, field, ph }) => (
                <div key={field} className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-gray-400">{label}</label>
                  <input
                    className="px-2.5 py-1.5 border border-black/14 rounded-md text-xs outline-none focus:border-[#FF6B00] bg-white"
                    placeholder={ph}
                    value={(form as any)[field]}
                    onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  />
                </div>
              ))}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-gray-400">Type</label>
                <select
                  className="px-2.5 py-1.5 border border-black/14 rounded-md text-xs outline-none focus:border-[#FF6B00] bg-white"
                  value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value as 'commercial'|'residential' }))}
                >
                  <option value="commercial">Commercial</option>
                  <option value="residential">Residential</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-gray-400">Accent Color</label>
                <input type="color" className="h-8 w-full rounded-md border border-black/14 cursor-pointer"
                  value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}/>
              </div>
              <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
                <label className="text-[11px] font-semibold text-gray-400">Google Sheet CSV URL *</label>
                <input
                  type="url"
                  className="px-2.5 py-1.5 border border-black/14 rounded-md text-xs outline-none focus:border-[#FF6B00] bg-white"
                  placeholder="https://docs.google.com/spreadsheets/d/YOUR_ID/export?format=csv&gid=0"
                  value={form.sheetUrl}
                  onChange={e => setForm(f => ({ ...f, sheetUrl: e.target.value }))}
                />
              </div>
            </div>
            {formErr && <p className="mt-2 text-xs text-red-600 font-medium">{formErr}</p>}
            <button
              onClick={add}
              className="mt-3 w-full sm:w-auto px-4 py-2 bg-[#FF6B00] text-white text-xs font-semibold rounded-lg hover:bg-[#CC5500] transition-all"
            >
              Add Project
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-black/8 flex gap-2 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="flex-1 sm:flex-none px-4 py-2 text-xs font-medium border border-black/14 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(list)}
            className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold bg-[#FF6B00] text-white rounded-lg hover:bg-[#CC5500] transition-all"
          >
            Save & Apply
          </button>
        </div>
      </div>
    </div>
  )
}
