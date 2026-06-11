interface Props {
  stats: { total: number; avail: number; sold: number; booked: number }
}

export default function StatsStrip({ stats }: Props) {
  const cells = [
    { label: 'Total',     value: stats.total,  cls: 'text-[#FF6B00]' },
    { label: 'Available', value: stats.avail,  cls: 'text-[#15803D]' },
    { label: 'Sold',      value: stats.sold,   cls: 'text-[#B91C1C]' },
    { label: 'Booked',    value: stats.booked, cls: 'text-[#92400E]' },
  ]
  return (
    <div className="grid grid-cols-4 border-b border-black/8" style={{ gap: '1px', background: 'rgba(0,0,0,0.08)' }}>
      {cells.map(c => (
        <div key={c.label} className="bg-white px-2 md:px-5 py-2.5 md:py-3.5 text-center md:text-left">
          <div className="text-[10px] md:text-[11px] text-gray-400 font-medium mb-0.5">{c.label}</div>
          <div className={`text-lg md:text-2xl font-bold ${c.cls}`}>{c.value || '—'}</div>
        </div>
      ))}
    </div>
  )
}
