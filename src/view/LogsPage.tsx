import { useState } from 'react'
import { logs } from '../lib/data'
import { LogsIcon, CitizensIcon, RefreshIcon, DownloadIcon } from '../lib/icons'
import StatCard from '../components/ui/StatCard'
import Badge from '../components/ui/Badge'
import { SearchBar, FilterBtn } from '../components/ui/SearchBar'
import Pagination from '../components/ui/Pagination'
import SectionHeader from '../components/ui/SectionHeader'

export default function LogsPage() {
  const [search, setSearch] = useState('')

  const filtered = logs.filter(l =>
    l.user.toLowerCase().includes(search.toLowerCase()) ||
    l.proc.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <SectionHeader
        title="System logs"
        subtitle="Track and monitor all events and procedures within the system to ensure transparency and security."
        action={
          <button className="btn-confirm text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm">
            <DownloadIcon /> logs Export
          </button>
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total transactions today" value="1,250"                      icon={<LogsIcon />}     />
        <StatCard label="Active users"             value="62 currently in the system" icon={<CitizensIcon />} />
        <StatCard label="Last updated logs"        value="2 minutes ago"              icon={<RefreshIcon />}  />
      </div>

      <SearchBar placeholder="Search the system logs" onSearch={setSearch}>
        <FilterBtn />
      </SearchBar>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              {['#', 'Date and time', 'user', 'Procedure', 'Result'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-gray-700">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{l.id}</td>
                <td className="px-4 py-3 text-gray-600">{l.datetime}</td>
                <td className="px-4 py-3 text-gray-700 font-medium">{l.user}</td>
                <td className="px-4 py-3 text-gray-500">{l.proc}</td>
                <td className="px-4 py-3"><Badge status={l.result} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination />
      </div>
    </div>
  )
}
