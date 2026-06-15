import type { ReactNode } from 'react'
import { SearchIcon, FilterIcon } from '../../lib/icons'

interface SearchBarProps {
  placeholder: string
  onSearch?: (value: string) => void
  children?: ReactNode
}

export function SearchBar({ placeholder, onSearch, children }: SearchBarProps) {
  return (
    <div className="search-gradient rounded-xl p-4 flex items-center gap-3 mb-6">
      <div className="flex-1 bg-white rounded-lg flex items-center gap-2 px-3 py-2.5 shadow-sm">
        <SearchIcon />
        <input
          className="flex-1 outline-none text-sm text-gray-600 bg-transparent"
          placeholder={placeholder}
          onChange={e => onSearch?.(e.target.value)}
        />
      </div>
      {children}
    </div>
  )
}

export function FilterBtn() {
  return (
    <button className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 flex items-center gap-2 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
      <FilterIcon />
      Filters
    </button>
  )
}
