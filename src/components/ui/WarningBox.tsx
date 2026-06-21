import { WarningIcon } from '@/lib/icons'

export default function WarningBox({ text }: { text: string }) {
  return (
    <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 my-4">
      <WarningIcon />
      <p className="text-sm text-gray-700 font-medium">{text}</p>
    </div>
  )
}
