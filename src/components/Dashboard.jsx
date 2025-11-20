import { useEffect, useState } from 'react'
import { apiGet } from './Api'

export default function Dashboard() {
  const [stats, setStats] = useState({ patients: 0, doctors: 0, appointments: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet('/stats')
        setStats(data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {['patients','doctors','appointments'].map((k) => (
        <div key={k} className="bg-white rounded-xl border p-6 shadow-sm">
          <div className="text-sm text-slate-500 capitalize">{k}</div>
          <div className="text-3xl font-semibold mt-2">{loading ? '…' : stats[k]}</div>
        </div>
      ))}
      {error && <div className="sm:col-span-3 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded">{error}</div>}
    </div>
  )
}
