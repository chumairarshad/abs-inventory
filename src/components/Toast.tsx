'use client'

export default function Toast({ message }: { message: string }) {
  if (!message) return null
  return (
    <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium z-[9999] flex items-center gap-2 shadow-2xl toast show">
      <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
      {message}
    </div>
  )
}
