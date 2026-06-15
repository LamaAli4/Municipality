const barData = [
  { month: 'Jan', value: 90 },
  { month: 'Feb', value: 78 },
  { month: 'Mar', value: 27 },
  { month: 'Apr', value: 52 },
  { month: 'May', value: 58 },
  { month: 'Jun', value: 15 },
]

const maxBar = 90

export default function PerformancePanelPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Performance Panel</h1>
        <p className="text-sm text-gray-500">Water Department — service performance overview</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Requests', value: '320', change: '+12%' },
          { label: 'Completed', value: '248', change: '+8%' },
          { label: 'Avg. Processing', value: '6.2d', change: '-1.3d' },
          { label: 'Satisfaction', value: '87%', change: '+3%' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">{k.label}</p>
            <p className="text-2xl font-bold text-gray-800">{k.value}</p>
            <p className="text-xs text-teal-600 font-medium mt-1">{k.change} from last month</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Bar chart */}
        <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-6">Monthly Requests</h2>
          <div className="flex items-end gap-4 h-52">
            {barData.map(d => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">{d.value}</span>
                <div
                  className="w-full rounded-t-lg"
                  style={{
                    height: `${(d.value / maxBar) * 180}px`,
                    background: 'linear-gradient(to top, #0d3a47, #0d9488)',
                  }}
                />
                <span className="text-xs text-gray-400">{d.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-gray-100 pt-4 flex items-center gap-3 text-xs text-gray-500">
            <div className="w-3 h-3 rounded-sm" style={{ background: 'linear-gradient(to top,#0d3a47,#0d9488)' }} />
            <span>Monthly service requests</span>
          </div>
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-6">By Service Type</h2>
          <div className="flex justify-center mb-6">
            <PieChart />
          </div>
          <div className="space-y-2 text-sm">
            <LegendItem color="#0d3a47" label="Water subscription" pct="75%" />
            <LegendItem color="#0d9488" label="Building permit" pct="20%" />
            <LegendItem color="#d1d5db" label="Other services" pct="5%" />
          </div>
        </div>
      </div>

      {/* Staff performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Staff Performance</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-2 text-gray-500 font-medium">Employee</th>
              <th className="text-left py-2 text-gray-500 font-medium">Section</th>
              <th className="text-left py-2 text-gray-500 font-medium">Tasks Completed</th>
              <th className="text-left py-2 text-gray-500 font-medium">Avg. Time</th>
              <th className="text-left py-2 text-gray-500 font-medium">Score</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Ali Hassan', section: 'Water Supply', completed: 18, avgTime: '5.2d', score: 92 },
              { name: 'Sara Ahmed', section: 'Sewage', completed: 24, avgTime: '4.8d', score: 96 },
              { name: 'Fatima Noor', section: 'Water Supply', completed: 14, avgTime: '6.1d', score: 85 },
            ].map(s => (
              <tr key={s.name} className="border-b border-gray-50 last:border-0">
                <td className="py-3 font-medium text-gray-800">{s.name}</td>
                <td className="py-3 text-gray-600">{s.section}</td>
                <td className="py-3 text-gray-600">{s.completed}</td>
                <td className="py-3 text-gray-600">{s.avgTime}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-2 max-w-20">
                      <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${s.score}%` }} />
                    </div>
                    <span className="text-teal-600 font-semibold">{s.score}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function PieChart() {
  const size = 140
  const cx = 70, cy = 70, r = 50
  const segments = [
    { pct: 75, color: '#0d3a47' },
    { pct: 20, color: '#0d9488' },
    { pct: 5, color: '#d1d5db' },
  ]

  let startAngle = -90
  const paths = segments.map(seg => {
    const angle = seg.pct * 3.6
    const endAngle = startAngle + angle
    const start = polarToCartesian(cx, cy, r, startAngle)
    const end = polarToCartesian(cx, cy, r, endAngle)
    const largeArc = angle > 180 ? 1 : 0
    const d = `M${cx},${cy} L${start.x},${start.y} A${r},${r},0,${largeArc},1,${end.x},${end.y} Z`
    startAngle = endAngle
    return { d, color: seg.color }
  })

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {paths.map((p, i) => <path key={i} d={p.d} fill={p.color} />)}
      <circle cx={cx} cy={cy} r={28} fill="white" />
    </svg>
  )
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function LegendItem({ color, label, pct }: { color: string; label: string; pct: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: color }} />
        <span className="text-gray-600 text-xs">{label}</span>
      </div>
      <span className="text-xs font-semibold text-gray-800">{pct}</span>
    </div>
  )
}
