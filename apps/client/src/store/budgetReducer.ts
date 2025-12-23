import { type BudgetState, type BudgetAction} from "../types/budget.types"

export const budgetReducer = (state: BudgetState, action: BudgetAction): BudgetState => {
    switch(action.type) {
        case "UPDATE_CELL": {
            const { budgetType, rowId, monthIndex, value } = action
            const budgetData = state[budgetType]
            
            const updatedBudgetData = budgetData.map(row => {
                if (row.id === rowId) {
                    const updatedMonthlyData = [...row.monthly_data]
                    updatedMonthlyData[monthIndex] = value
                    const year_total = updatedMonthlyData.reduce((sum, amount) => sum + amount, 0)
                    
                    return {
                        ...row,
                        monthly_data: updatedMonthlyData,
                        year_total
                    }
                }
                return row
            })
            
            return {
                ...state,
                [budgetType]: updatedBudgetData
            }
        }
        case "SET_BUDGET": {
            return {
                income: action.income,
                vital: action.vital,
                nonVital: action.nonVital
            }
        }
        default:
            return state
    }
}