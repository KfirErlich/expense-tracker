import type { BudgetData } from '@shared'
import { 
    INITIAL_INCOME_BUDGET_DATA,
    INITIAL_NON_VITAL_EXPENSES_BUDGET_DATA,
    INITIAL_VITAL_EXPENSES_BUDGET_DATA
} from '@shared'

export interface BudgetState {
    income: BudgetData
    nonVital: BudgetData
    vital: BudgetData
}

export const initialState: BudgetState = {
    income: INITIAL_INCOME_BUDGET_DATA,
    nonVital: INITIAL_NON_VITAL_EXPENSES_BUDGET_DATA,
    vital: INITIAL_VITAL_EXPENSES_BUDGET_DATA
}

type BudgetAction = 
    | {
        type: 'UPDATE_CELL'
        budgetType: 'income' | 'nonVital' | 'vital'
        rowId: string
        monthIndex: number
        value: number
    }
    | {
        type: 'SET_BUDGET'
        income: BudgetData
        vital: BudgetData
        nonVital: BudgetData
    }

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