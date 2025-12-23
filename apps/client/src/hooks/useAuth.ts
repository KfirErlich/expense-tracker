import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../config/firebase'
import { authService } from '../services/authService'

export const useAuth = () => {
  const [userId, setUserId] = useState<string>('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true)
        setUserId(user.uid)
      } else {
        setIsLoggedIn(false)
        setUserId('')
      }
      setAuthLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (err: any) {
      console.error('Error logging out:', err)
    }
  }

  return {
    userId,
    isLoggedIn,
    authLoading,
    handleLogout
  }
}

