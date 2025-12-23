export interface LoginState {
    isRegisterMode: boolean
    email: string
    password: string
    fullName: string
    error: string | null
    loading: boolean
}

export const initialState: LoginState = {
    isRegisterMode: false,
    email: '',
    password: '',
    fullName: '',
    error: null,
    loading: false
}

export type LoginAction =
    | { type: 'SET_EMAIL'; payload: string }
    | { type: 'SET_PASSWORD'; payload: string }
    | { type: 'SET_FULL_NAME'; payload: string }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'TOGGLE_MODE' }
    | { type: 'RESET_FORM' }


export interface LoginProps {
    onLoginSuccess: () => void
}