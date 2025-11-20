import { Hospital, CalendarDays, Users, Stethoscope } from 'lucide-react'

export default function Header({ current, onNavigate }) {
  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: Hospital },
    { key: 'patients', label: 'Patients', icon: Users },
    { key: 'doctors', label: 'Doctors', icon: Stethoscope },
    { key: 'appointments', label: 'Appointments', icon: CalendarDays },
  ]

  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-600 text-white"><Hospital size={20} /></div>
          <span className="font-semibold text-slate-800">CareFlow</span>
        </div>
        <nav className="flex items-center gap-2">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => onNavigate(t.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${current===t.key ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
