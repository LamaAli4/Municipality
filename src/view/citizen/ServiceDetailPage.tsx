import type { CitizenNavigateFn } from '../../lib/types'
import { ChevronLeftIcon } from '../../lib/icons'
import { useServiceDetail } from '../../services/servicesService'

interface Props {
  navigate: CitizenNavigateFn
  serviceId: string | null
}

export default function ServiceDetailPage({ navigate, serviceId }: Props) {
  const { data: service, isLoading, isError } = useServiceDetail(serviceId)

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('services')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-teal-600">
        <ChevronLeftIcon /> Back To Services
      </button>

      {isLoading && (
        <div className="flex items-center justify-center py-16 text-gray-400 text-sm">Loading service details...</div>
      )}
      {isError && (
        <div className="text-center py-16 text-red-500 text-sm">Failed to load service details</div>
      )}

      {!isLoading && !isError && service && (
        <>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{service.name}</h1>
            <p className="text-sm text-gray-500">{service.description}</p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h2 className="font-semibold text-gray-800 mb-4">Service Information</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    ['Service name', service.name],
                    ['Department ID', service.department_id],
                    ['Processing time', `${service.estimated_processing_days} working days`],
                    ['Service fee', service.fee === 0 ? 'Free' : `$${service.fee}`],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <p className="text-gray-400 text-xs mb-0.5">{k}</p>
                      <p className="text-gray-700 font-medium">{v}</p>
                    </div>
                  ))}
                </div>
              </div>

              {service.workflow_tasks.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h2 className="font-semibold text-gray-800 mb-4">Service Path</h2>
                  <div className="space-y-3">
                    {service.workflow_tasks
                      .sort((a, b) => a.task_order - b.task_order)
                      .map((task, i) => (
                        <div key={task.id} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {i + 1}
                          </div>
                          <div>
                            <p className="text-sm text-gray-700 font-medium">{task.name}</p>
                            <p className="text-xs text-gray-400">{task.description} · {task.estimated_time_hours}h</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h2 className="font-semibold text-gray-800 mb-4">Required Documents</h2>
                {service.required_documents.length === 0 ? (
                  <p className="text-sm text-gray-400">No documents required</p>
                ) : (
                  <ul className="space-y-2">
                    {service.required_documents.map((doc) => (
                      <li key={doc.id} className="flex items-center gap-2 text-sm text-gray-700">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        {doc.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                onClick={() => navigate('service-request')}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm"
                style={{ background: 'linear-gradient(135deg, #0d9488, #0a7569)' }}
              >
                Start Application
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
