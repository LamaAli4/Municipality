import type { NavigateFn } from '@/lib/types'
import { ChevronLeftIcon, PlusIcon } from '@/lib/icons'
import { PrimaryBtn } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'

export default function AddServicePage({ navigate }: { navigate: NavigateFn }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('service')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm font-medium"
        >
          <ChevronLeftIcon /> Back to service management
        </button>
        <PrimaryBtn label="Deploy the service" />
      </div>

      <h1 className="text-xl font-bold text-gray-800 mb-1">Add a new service</h1>
      <p className="text-sm text-gray-500 mb-6">
        Adding a new municipal service for citizens and specifying the requirements and procedures
      </p>

      <div className="grid grid-cols-3 gap-4">
        {/* Basic Info */}
        <div className="col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gray-100 px-5 py-3 border-b border-gray-200">
            <h2 className="font-bold text-gray-800">Basic service information</h2>
          </div>
          <div className="p-5 space-y-4">
            <Input label="Service name" placeholder="Enter the service name" />
            <Textarea label="Description" placeholder="Enter a detailed description of the service." />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Department"      placeholder="" />
              <Input label="Section"         placeholder="" />
              <Input label="Fees"            placeholder="" />
              <Input label="Processing time" placeholder="" />
            </div>
          </div>
        </div>

        {/* Side Panels */}
        <div className="space-y-4">
          {[
            { title: 'Required documents', action: 'Add a document' },
            { title: 'Workflow steps',     action: 'Add a step'     },
          ].map(({ title, action }) => (
            <div key={title} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                <h2 className="font-bold text-gray-800 text-sm">{title}</h2>
              </div>
              <div className="p-6 flex flex-col items-center justify-center gap-2">
                <button className="w-12 h-12 border-2 border-gray-300 rounded-xl flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                  <PlusIcon />
                </button>
                <p className="text-sm font-medium text-gray-600">{action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
