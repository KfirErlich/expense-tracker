import { type LoginState, type LoginAction} from '../types/login.types'

export const loginReducer = (state: LoginState, action: LoginAction): LoginState => {
    switch (action.type) {
        case 'SET_EMAIL':
            return {
                ...state,
                email: action.payload
            }
        case 'SET_PASSWORD':
            return {
                ...state,
                password: action.payload
            }
        case 'SET_FULL_NAME':
            return {
                ...state,
                fullName: action.payload
            }
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload
            }
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload
            }
        case 'TOGGLE_MODE':
            return {
                ...state,
                isRegisterMode: !state.isRegisterMode,
                error: null,
                email: '',
                password: '',
                fullName: ''
            }
        case 'RESET_FORM':
            return {
                ...state,
                email: '',
                password: '',
                fullName: '',
                error: null
            }
        default:
            return state
    }
}

