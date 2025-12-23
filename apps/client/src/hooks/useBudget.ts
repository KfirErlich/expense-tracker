import { useReducer, useEffect, useState } from 'react'
import { budgetReducer } from '../store/budgetReducer'
import { initialBudgetState } from '../types/budget.types'
import { budgetService } from '../services/api'

export const useBudget = (userId: string, currentYear: number) => {
  const [state, dispatch] = useReducer(budgetReducer, initialBudgetState)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchBudget = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('Fetching budget for year:', currentYear, 'userId:', userId)
        const response = await budgetService.getBudget(currentYear, userId)
        console.log('Budget response received:', response)
        
        // The API returns { budget: { income, vital, nonVital }, userId }
        if (response.budget) {
          dispatch({
            type: 'SET_BUDGET',
            income: response.budget.income,
            vital: response.budget.vital,
            nonVital: response.budget.nonVital
          })
          console.log('Budget data loaded successfully')
        } else {
          throw new Error('Invalid response format: budget data not found')
        }
      } catch (err: any) {
        console.error('Error fetching budget:', err)
        const errorMessage = err?.response?.data?.message || err?.message || 'Failed to fetch budget data'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchBudget()
  }, [currentYear, userId])

  const updateCell = async (budgetType: 'income' | 'nonVital' | 'vital', rowId: string, monthIndex: number, value: number) => {
    // Calculate the updated monthly_data before dispatching
    const budgetData = state[budgetType]
    const category = budgetData.find(row => row.id === rowId)
    
    if (!category) return

    const updatedMonthlyData = [...category.monthly_data]
    updatedMonthlyData[monthIndex] = value

    // Update local state
    dispatch({
      type: 'UPDATE_CELL',
      budgetType,
      rowId,
      monthIndex,
      value
    })

    // Call API to persist the update
    if (userId) {
      try {
        await budgetService.updateBudget(
          currentYear,
          userId,
          budgetType,
          rowId,
          updatedMonthlyData
        )
      } catch (err: any) {
        console.error('Error updating budget:', err)
      }
    }
  }

  return {
    state,
    loading,
    error,
    updateCell
  }
}

