import { useState } from 'react'
import type { NavigateFn } from '@/lib/types'
import { services } from '@/lib/data'
import { PlusIcon, EditIcon, TrashIcon } from '@/lib/icons'
import SectionHeader from '@/components/ui/SectionHeader'
import { PrimaryBtn } from '@/components/ui/Button'
import { SearchBar, FilterBtn } from '@/components/ui/SearchBar'
import Pagination from '@/components/ui/Pagination'

export default function ServicePage({ navigate }: { navigate: NavigateFn }) {
  const [search, setSearch] = useState('')

  const filtered = services.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <SectionHeader
        title="Municipal services administration"
        subtitle="Presentation and management of services provided to citizens"
        action={
          <PrimaryBtn
            label="Add a new service"
            icon={<PlusIcon />}
            onClick={() => navigate('add-service')}
          />
        }
      />

      <SearchBar placeholder="Search by service name" onSearch={setSearch}>
        <FilterBtn />
      </SearchBar>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              {['#', 'Service name', 'Department', 'Date added', 'Edit', 'Delete'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-gray-700">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{s.id}</td>
                <td className="px-4 py-3 text-gray-700">{s.name}</td>
                <td className="px-4 py-3 text-gray-500">{s.dept}</td>
                <td className="px-4 py-3 text-gray-500">{s.date}</td>
                <td className="px-4 py-3"><button><EditIcon /></button></td>
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
