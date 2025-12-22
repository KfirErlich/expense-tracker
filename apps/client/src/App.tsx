import './App.css'
import { Table } from './components/Table'
import SummaryTable from './components/SummaryTable'
import { useReducer, useEffect, useState } from 'react'
import { budgetReducer, initialState } from './store/budgetReducer'
import { budgetService } from './services/api'
import YearDropdown from './components/YearDropdown'

/* TODO: 
- Move all Data to a Database
- Create a dropdown to select the year
*/

function App() {
  const [state, dispatch] = useReducer(budgetReducer, initialState)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string>('')
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear())

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('Fetching budget for year:', currentYear)
        const response = await budgetService.getBudget(currentYear)
        console.log('Budget response received:', response)
        
        // The API returns { budget: { income, vital, nonVital }, userId }
        if (response.budget) {
          dispatch({
            type: 'SET_BUDGET',
            income: response.budget.income,
            vital: response.budget.vital,
            nonVital: response.budget.nonVital
          })
          if (response.userId) {
            setUserId(response.userId)
          }
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
  }, [currentYear])

  const handleUpdateCell = (budgetType: 'income' | 'nonVital' | 'vital') => {
    return async (rowId: string, monthIndex: number, value: number) => {
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
          // Optionally show error to user or revert the change
        }
      }
    }
  }

  const handleIncomeUpdates = handleUpdateCell('income')
  const handleVitalUpdates = handleUpdateCell('vital')
  const handleNonVitalUpdates = handleUpdateCell('nonVital')

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg">Loading budget data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg text-red-600">Error: {error}</p>
        <p className="text-sm text-gray-600 mt-2">Make sure the server is running on http://localhost:3001</p>
      </div>
    )
  }

  return (
      <div className="flex flex-col items-center min-h-screen py-8 gap-8 px-4">
        <YearDropdown currentYear={currentYear} setCurrentYear={setCurrentYear} userId={userId} />
        <div className="w-full max-w-7xl">
          <h2 className="text-2xl font-bold mb-4">Income</h2>
          <Table budgetData={state.income} handleUpdateCell={handleIncomeUpdates} />
        </div>
        <div className="w-full max-w-7xl">
          <h2 className="text-2xl font-bold mb-4">Vital Expenses</h2>
          <Table budgetData={state.vital} handleUpdateCell={handleVitalUpdates} />
        </div>
        <div className="w-full max-w-7xl">
          <h2 className="text-2xl font-bold mb-4">Non-Vital Expenses</h2>
          <Table budgetData={state.nonVital} handleUpdateCell={handleNonVitalUpdates} />
        </div>
        <div className="w-full max-w-7xl">
          <h2 className="text-2xl font-bold mb-4">Summary</h2>
          <SummaryTable income={state.income} vital={state.vital} nonVital={state.nonVital} />
        </div>
      </div>
  )
}

export default App
