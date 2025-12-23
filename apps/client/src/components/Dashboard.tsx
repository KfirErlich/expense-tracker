import { Table } from './Table'
import SummaryTable from './SummaryTable'
import YearDropdown from './YearDropdown'
import type { BudgetState } from '../types/budget.types'

interface DashboardProps {
  state: BudgetState
  loading: boolean
  error: string | null
  currentYear: number
  setCurrentYear: (year: number) => void
  userId: string
  onUpdate: (budgetType: 'income' | 'nonVital' | 'vital', rowId: string, monthIndex: number, value: number) => Promise<void>
  onLogout: () => Promise<void>
}

const Dashboard = ({ state, loading, error, currentYear, setCurrentYear, userId, onUpdate, onLogout }: DashboardProps) => {
  const handleUpdateCell = (budgetType: 'income' | 'nonVital' | 'vital') => {
    return async (rowId: string, monthIndex: number, value: number) => {
      await onUpdate(budgetType, rowId, monthIndex, value)
    }
  }

  const handleIncomeUpdates = handleUpdateCell('income')
  const handleVitalUpdates = handleUpdateCell('vital')
  const handleNonVitalUpdates = handleUpdateCell('nonVital')

  const tableCategories = [
    { title: 'Income', budgetData: state.income, handleUpdateCell: handleIncomeUpdates },
    { title: 'Vital Expenses', budgetData: state.vital, handleUpdateCell: handleVitalUpdates },
    { title: 'Non-Vital Expenses', budgetData: state.nonVital, handleUpdateCell: handleNonVitalUpdates }
  ]

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
      <div className="w-full max-w-7xl flex flex-col items-center justify-between mb-4 gap-4">
        <img 
          src="/expense-tracker-high-resolution-logo-transparent.png" 
          alt="Expense Tracker Logo" 
          className="h-32 w-auto object-contain"
        />
        <YearDropdown currentYear={currentYear} setCurrentYear={setCurrentYear} userId={userId} />
      </div>
      {tableCategories.map(({ title, budgetData, handleUpdateCell }) => (
        <div key={title} className="w-full max-w-7xl">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <Table budgetData={budgetData} handleUpdateCell={handleUpdateCell} />
        </div>
      ))}
      <div className="w-full max-w-7xl">
        <h2 className="text-2xl font-bold mb-4">Summary</h2>
        <SummaryTable income={state.income} vital={state.vital} nonVital={state.nonVital} />
      </div>
      <div className="w-full max-w-7xl flex justify-center mt-4">
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-red-500 focus:ring-offset-2 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Dashboard
