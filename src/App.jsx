import { useState } from 'react'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import Patients from './components/Patients'
import Doctors from './components/Doctors'
import Appointments from './components/Appointments'

function App() {
  const [tab, setTab] = useState('dashboard')

  return (
    <div className="min-h-screen bg-slate-50">
      <Header current={tab} onNavigate={setTab} />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'patients' && <Patients />}
        {tab === 'doctors' && <Doctors />}
        {tab === 'appointments' && <Appointments />}
      </main>
    </div>
  )
}

export default App
