import './App.css'
import { Table } from './components/Table'
import SummaryTable from './components/SummaryTable'
import { useReducer, useCallback } from 'react'
import { budgetReducer, initialState } from './store/budgetReducer'

/* TODO: 
- Create another Table for the yearly status (Total, Average, Month with the highest and lowest)
- Move all Data to a Database
- Create a dropdown to select the year
*/

function App() {
  const [state, dispatch] = useReducer(budgetReducer, initialState)


  const handleUpdateCell = useCallback((budgetType: 'income' | 'nonVital' | 'vital') => {
    console.log("createUpdateHandler")
    return (rowId: string, monthIndex: number, value: number) => {
      dispatch({
        type: 'UPDATE_CELL',
        budgetType,
        rowId,
        monthIndex,
        value
      })
    }
  }, [])

  const handleIncomeUpdates = handleUpdateCell('income')
  const handleVitalUpdates = handleUpdateCell('vital')
  const handleNonVitalUpdates = handleUpdateCell('nonVital')

  return (
      <div className="flex flex-col items-center min-h-screen py-8 gap-8 px-4">
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
