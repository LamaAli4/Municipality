import Modal from '../../components/ui/Modal'
import { useSection } from '../../services/sectionsService'

interface Props {
  onClose: () => void
  sectionId: string
  departmentName?: string
  employeesCount?: number
}

export default function SectionDetailModal({ onClose, sectionId, departmentName, employeesCount }: Props) {
  const { data: section, isLoading, isError } = useSection(sectionId)

  return (
    <Modal title="Section Details" onClose={onClose}>
      {isLoading && (
        <div className="text-center py-8 text-gray-400 text-sm">Loading…</div>
      )}
      {isError && (
        <div className="text-center py-8 text-red-500 text-sm">Failed to load section details</div>
      )}
      {!isLoading && !isError && section && (
        <div className="space-y-4">
          {([
            ['Section name',  section.name],
            ['Department',    departmentName ?? section.department?.name ?? '—'],
            ['Description',   section.description ?? '—'],
            ['Employees',     String(employeesCount ?? section.employees_count ?? section._count?.employees ?? 0)],
            ['Status',        section.is_active ? 'Active' : 'Inactive'],
          ] as [string, string][]).map(([label, value]) => (
            <div key={label} className="flex items-start gap-4 border-b border-gray-100 pb-3 last:border-0">
              <p className="w-36 text-sm font-semibold text-gray-600 shrink-0">{label}</p>
              <p className="text-sm text-gray-500">{value}</p>
            </div>
          ))}
        </div>
      )}
    </Modal>
  )
}
