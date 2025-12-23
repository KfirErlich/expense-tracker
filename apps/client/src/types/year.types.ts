export interface YearState {
    availableYears: number[]
    newYearInput: string
    loading: boolean
    error: string | null
    showAddForm: boolean
}

export const initialYearState: YearState = {
    availableYears: [new Date().getFullYear()],
    newYearInput: '',
    loading: false,
    error: null,
    showAddForm: false
}

export type YearAction =
    | { type: 'SET_AVAILABLE_YEARS'; payload: number[] }
    | { type: 'SET_NEW_YEAR_INPUT'; payload: string }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'ADD_YEAR'; payload: number }
    | { type: 'CLEAR_ERROR' }
    | { type: 'RESET_NEW_YEAR_INPUT' }
    | { type: 'TOGGLE_ADD_FORM' }
    | { type: 'SET_SHOW_ADD_FORM'; payload: boolean }

