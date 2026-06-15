interface RadioOptionProps {
  label: string
  checked: boolean
  onChange: () => void
}

export default function RadioOption({ label, checked, onChange }: RadioOptionProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer" onClick={onChange}>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${checked ? 'border-primary' : 'border-gray-400'}`}>
        {checked && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  )
}
