export default function InfoCard({ fields }: { fields: [string, string][] }) {
  return (
    <div className="bg-gray-100 rounded-xl p-4 grid grid-cols-2 gap-3">
      {fields.map(([label, value]) => (
        <div key={label}>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-sm font-semibold text-gray-800">{value}</p>
        </div>
      ))}
    </div>
  )
}
