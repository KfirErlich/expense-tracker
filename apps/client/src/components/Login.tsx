import { useReducer } from 'react'
import type { FormEvent } from 'react'
import { authService } from '../services/authService'
import { updateProfile } from 'firebase/auth'
import { auth } from '../config/firebase'
import { loginReducer } from '../store/loginReducer'
import { initialState, type LoginProps } from '../types/login.types'


export default function Login({ onLoginSuccess }: LoginProps) {
  const [state, dispatch] = useReducer(loginReducer, initialState)

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    dispatch({ type: 'SET_ERROR', payload: null })
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      await authService.login(state.email, state.password)
      onLoginSuccess()
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to login. Please check your credentials.' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()
    dispatch({ type: 'SET_ERROR', payload: null })
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      await authService.register(state.email, state.password)
      // Update user profile with full name
      if (state.fullName && auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: state.fullName
        })
      }
      onLoginSuccess()
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to register. Please try again.' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const toggleMode = () => {
    dispatch({ type: 'TOGGLE_MODE' })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-6">
          <img 
            src="/expense-tracker-high-resolution-logo-transparent.png" 
            alt="Expense Tracker Logo" 
            className="h-32 w-auto object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {state.isRegisterMode ? 'Create Account' : 'Login'}
        </h1>
        
        <form onSubmit={state.isRegisterMode ? handleRegister : handleLogin} className="space-y-4">
          {state.isRegisterMode && (
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={state.fullName}
                onChange={(e) => dispatch({ type: 'SET_FULL_NAME', payload: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={state.email}
              onChange={(e) => dispatch({ type: 'SET_EMAIL', payload: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={state.password}
              onChange={(e) => dispatch({ type: 'SET_PASSWORD', payload: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          {state.error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {state.error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={state.loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {state.loading ? 'Processing...' : (state.isRegisterMode ? 'Register' : 'Login')}
            </button>
            
            <button
              type="button"
              onClick={toggleMode}
              disabled={state.loading}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {state.isRegisterMode ? 'Back to Login' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

