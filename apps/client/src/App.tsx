import './App.css'
import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useBudget } from './hooks/useBudget'
import { authService } from './services/authService'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

function App() {
  const { userId, isLoggedIn, authLoading } = useAuth()
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const { state, loading, error, updateCell } = useBudget(userId, currentYear)

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    )
  }
  if (!isLoggedIn) return <Login onLoginSuccess={() => {}} />

  return (
    <Dashboard 
      state={state}
      loading={loading}
      error={error}
      currentYear={currentYear}
      setCurrentYear={setCurrentYear}
      userId={userId}
      onUpdate={updateCell}
      onLogout={() => authService.logout()}
    />
  )
}

export default App
