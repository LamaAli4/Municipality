import { useState } from 'react'
import type { NavigateFn } from '@/lib/types'
import { citizens } from '@/lib/data'
import { CitizensIcon, EyeIcon, TrashIcon } from '@/lib/icons'
import StatCard from '@/components/ui/StatCard'
import Badge from '@/components/ui/Badge'
import { SearchBar, FilterBtn } from '@/components/ui/SearchBar'
import Pagination from '@/components/ui/Pagination'
import SectionHeader from '@/components/ui/SectionHeader'

export default function CitizensPage({ navigate }: { navigate: NavigateFn }) {
  const [search, setSearch] = useState('')

  const filtered = citizens.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.idNum.includes(search)
  )

  return (
    <div>
      <SectionHeader
        title="Citizens management"
        subtitle="View and manage the accounts of citizens registered in the system"
      />

      <div className="mb-6 max-w-xs">
        <StatCard label="Total citizens" value="1,250" icon={<CitizensIcon />} />
      </div>

      <SearchBar placeholder="Enter name or national ID number" onSearch={setSearch}>
        <FilterBtn />
      </SearchBar>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              {['#', 'Citizens', 'ID number', 'Status', 'View', 'Delete'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-gray-700">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{c.id}</td>
                <td className="px-4 py-3 text-gray-700">{c.name}</td>
                <td className="px-4 py-3 text-gray-500">{c.idNum}</td>
                <td className="px-4 py-3"><Badge status={c.status} /></td>
                <td className="px-4 py-3">
                  <button onClick={() => navigate('citizen-detail')}><EyeIcon /></button>
                </td>
                <td className="px-4 py-3"><button><TrashIcon /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination />
      </div>
    </div>
  )
}
