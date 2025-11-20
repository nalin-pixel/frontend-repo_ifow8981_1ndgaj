import { useEffect, useState } from 'react'
import { apiGet, apiPost } from './Api'

export default function Patients() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const data = await apiGet('/patients')
      setItems(data)
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
      await apiPost('/patients', form)
      setForm({ first_name: '', last_name: '', email: '', phone: '' })
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
          <h3 className="font-semibold text-slate-800">Patients</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Phone</th>
                <th className="py-2 pr-4">ID</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="py-4" colSpan={4}>Loading…</td></tr>
              ) : items.length === 0 ? (
                <tr><td className="py-4" colSpan={4}>No patients yet</td></tr>
              ) : items.map(p => (
                <tr key={p.id} className="border-t">
                  <td className="py-2 pr-4">{p.first_name} {p.last_name}</td>
                  <td className="py-2 pr-4">{p.email || '—'}</td>
                  <td className="py-2 pr-4">{p.phone || '—'}</td>
                  <td className="py-2 pr-4 font-mono text-xs">{p.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {error && <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded">{error}</div>}
      </div>

      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-4">Add Patient</h3>
        <form onSubmit={submit} className="space-y-3">
          {['first_name','last_name','email','phone'].map((k) => (
            <div key={k}>
              <label className="block text-xs text-slate-500 mb-1 capitalize">{k.replace('_',' ')}</label>
              <input value={form[k]} onChange={e=>setForm({ ...form, [k]: e.target.value })} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          ))}
          <button disabled={saving} className="w-full bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50">{saving ? 'Saving…' : 'Save'}</button>
        </form>
      </div>
    </div>
  )
}
