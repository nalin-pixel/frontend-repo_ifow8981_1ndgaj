import { useEffect, useState } from 'react'
import { apiGet, apiPost } from './Api'

export default function Appointments() {
  const [items, setItems] = useState([])
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ patient_id: '', doctor_id: '', start_time: '', duration_minutes: 30, reason: '' })

  const load = async () => {
    setLoading(true)
    try {
      const [as, ps, ds] = await Promise.all([
        apiGet('/appointments'),
        apiGet('/patients'),
        apiGet('/doctors'),
      ])
      setItems(as)
      setPatients(ps)
      setDoctors(ds)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      // Ensure ISO format for datetime
      const payload = { ...form, duration_minutes: Number(form.duration_minutes) }
      await apiPost('/appointments', payload)
      setForm({ patient_id: '', doctor_id: '', start_time: '', duration_minutes: 30, reason: '' })
      await load()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2 bg-white rounded-xl border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">Appointments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-2 pr-4">When</th>
                <th className="py-2 pr-4">Patient</th>
                <th className="py-2 pr-4">Doctor</th>
                <th className="py-2 pr-4">Reason</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="py-4" colSpan={5}>Loading…</td></tr>
              ) : items.length === 0 ? (
                <tr><td className="py-4" colSpan={5}>No appointments yet</td></tr>
              ) : items.map(a => (
                <tr key={a.id} className="border-t">
                  <td className="py-2 pr-4">{new Date(a.start_time).toLocaleString()} ({a.duration_minutes}m)</td>
                  <td className="py-2 pr-4">{patients.find(p=>p.id===a.patient_id)?.first_name || a.patient_id}</td>
                  <td className="py-2 pr-4">{doctors.find(d=>d.id===a.doctor_id)?.last_name || a.doctor_id}</td>
                  <td className="py-2 pr-4">{a.reason || '—'}</td>
                  <td className="py-2 pr-4">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {error && <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded">{error}</div>}
      </div>

      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-4">Schedule Appointment</h3>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Patient</label>
            <select value={form.patient_id} onChange={e=>setForm({ ...form, patient_id: e.target.value })} className="w-full border rounded px-3 py-2">
              <option value="">Select patient</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Doctor</label>
            <select value={form.doctor_id} onChange={e=>setForm({ ...form, doctor_id: e.target.value })} className="w-full border rounded px-3 py-2">
              <option value="">Select doctor</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id}>{d.first_name} {d.last_name} · {d.department}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Start time</label>
            <input type="datetime-local" value={form.start_time} onChange={e=>setForm({ ...form, start_time: e.target.value })} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Duration (minutes)</label>
            <input type="number" min={5} max={240} value={form.duration_minutes} onChange={e=>setForm({ ...form, duration_minutes: e.target.value })} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Reason</label>
            <input value={form.reason} onChange={e=>setForm({ ...form, reason: e.target.value })} className="w-full border rounded px-3 py-2" />
          </div>
          <button disabled={saving} className="w-full bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50">{saving ? 'Saving…' : 'Schedule'}</button>
        </form>
      </div>
    </div>
  )
}
