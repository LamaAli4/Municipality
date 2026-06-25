interface PaginationProps {
  current: number
  total: number
  onChange: (page: number) => void
}

export default function Pagination({ current, total, onChange }: PaginationProps) {
  if (total <= 1) return null

  return (
    <div className="flex items-center gap-1 p-4 bg-gray-50 border-t border-gray-200">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="w-8 h-8 flex items-center justify-center rounded text-sm font-semibold border bg-white text-gray-600 border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ‹
      </button>
      {Array.from({ length: total }, (_, i) => i + 1).map(n => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`w-8 h-8 flex items-center justify-center rounded text-sm font-semibold border ${
            n === current
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
          }`}
        >
          {n}
        </button>
      ))}
      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="w-8 h-8 flex items-center justify-center rounded text-sm font-semibold border bg-white text-gray-600 border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ›
      </button>
    </div>
  )
}
