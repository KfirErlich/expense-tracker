import { type YearState, type YearAction } from '../types/year.types'

export const yearReducer = (state: YearState, action: YearAction): YearState => {
    switch (action.type) {
        case 'SET_AVAILABLE_YEARS':
            return {
                ...state,
                availableYears: action.payload
            }
        case 'SET_NEW_YEAR_INPUT':
            return {
                ...state,
                newYearInput: action.payload,
                error: null
            }
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload
            }
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload
            }
        case 'ADD_YEAR':
            const updatedYears = [...state.availableYears, action.payload].sort((a, b) => a - b)
            return {
                ...state,
                availableYears: updatedYears,
                newYearInput: ''
            }
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null
            }
        case 'RESET_NEW_YEAR_INPUT':
            return {
                ...state,
                newYearInput: ''
            }
        case 'TOGGLE_ADD_FORM':
            return {
                ...state,
                showAddForm: !state.showAddForm
            }
        case 'SET_SHOW_ADD_FORM':
            return {
                ...state,
                showAddForm: action.payload
            }
        default:
            return state
    }
}

