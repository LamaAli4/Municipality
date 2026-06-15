interface PaginationProps {
  current?: number
  total?: number
}

export default function Pagination({ current = 1, total = 4 }: PaginationProps) {
  return (
    <div className="flex items-center gap-1 p-4 bg-gray-50 border-t border-gray-200">
      {Array.from({ length: total }, (_, i) => i + 1).map(n => (
        <button
          key={n}
          className={`w-8 h-8 flex items-center justify-center rounded text-sm font-semibold border ${
            n === current
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  )
}
