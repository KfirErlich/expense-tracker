import './App.css'
import { Table } from './components/Table'
import { useState } from 'react'
import { INITIAL_INCOME_BUDGET_DATA,
   INITIAL_NON_VITAL_EXPENSES_BUDGET_DATA,
    INITIAL_VITAL_EXPENSES_BUDGET_DATA,
     type BudgetData
     } from './types/tablesDef'

function App() {
  const [incomeBudgetData, setIncomeBudgetData] = useState<BudgetData>(INITIAL_INCOME_BUDGET_DATA)
  const [nonVitalExpensesBudgetData, setNonVitalExpensesBudgetData] = useState<BudgetData>(INITIAL_NON_VITAL_EXPENSES_BUDGET_DATA)
  const [vitalExpensesBudgetData, setVitalExpensesBudgetData] = useState<BudgetData>(INITIAL_VITAL_EXPENSES_BUDGET_DATA)

  return (
      <div className="flex flex-col items-center min-h-screen py-8 gap-8 px-4">
        <div className="w-full max-w-7xl">
          <h2 className="text-2xl font-bold mb-4">Income</h2>
          <Table budgetData={incomeBudgetData} />
        </div>
        <div className="w-full max-w-7xl">
          <h2 className="text-2xl font-bold mb-4">Vital Expenses</h2>
          <Table budgetData={vitalExpensesBudgetData} />
        </div>
        <div className="w-full max-w-7xl">
          <h2 className="text-2xl font-bold mb-4">Non-Vital Expenses</h2>
          <Table budgetData={nonVitalExpensesBudgetData} />
        </div>
      </div>
  )
}

export default App
