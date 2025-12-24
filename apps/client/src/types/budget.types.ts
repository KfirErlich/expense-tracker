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

export const initialBudgetState: BudgetState = {
    income: INITIAL_INCOME_BUDGET_DATA,
    nonVital: INITIAL_NON_VITAL_EXPENSES_BUDGET_DATA,
    vital: INITIAL_VITAL_EXPENSES_BUDGET_DATA
}

export type BudgetAction = 
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
