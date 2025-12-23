import { useReducer, useEffect } from 'react'
import { budgetService } from '../services/api'
import { yearReducer } from '../store/yearReducer'
import { initialYearState } from '../types/year.types'

const YearDropdown = ({
    currentYear, 
    setCurrentYear, 
    userId
}: {
    currentYear: number, 
    setCurrentYear: (year: number) => void,
    userId: string
}) => {
    const [state, dispatch] = useReducer(yearReducer, initialYearState)

    useEffect(() => {
        if (state.showAddForm) {
            const nextYear = currentYear + 1
            dispatch({ type: 'SET_NEW_YEAR_INPUT', payload: nextYear.toString() })
        }
    }, [state.showAddForm, currentYear])

    useEffect(() => {
        const fetchYears = async () => {
            if (!userId) return
            
            try {
                const response = await budgetService.getYears(userId)
                if (response.years && response.years.length > 0) {
                    dispatch({ type: 'SET_AVAILABLE_YEARS', payload: response.years })
                    if (!response.years.includes(currentYear)) {
                        const newYear = response.years[0]
                        setCurrentYear(newYear)
                    }
                } else {
                    dispatch({ type: 'SET_AVAILABLE_YEARS', payload: [currentYear] })
                }
            } catch (err: any) {
                console.error('Error fetching years:', err)
                dispatch({ type: 'SET_ERROR', payload: 'Failed to load years' })
            }
        }

        fetchYears()
    }, [userId])

    const handleAddYear = async () => {
        if (!state.newYearInput.trim()) {
            dispatch({ type: 'SET_ERROR', payload: 'Please enter a year' })
            return
        }

        const yearToAdd = parseInt(state.newYearInput.trim())
        
        if (isNaN(yearToAdd)) {
            dispatch({ type: 'SET_ERROR', payload: 'Please enter a valid year' })
            return
        }

        if (state.availableYears.includes(yearToAdd)) {
            dispatch({ type: 'SET_ERROR', payload: 'This year already exists' })
            return
        }

        if (!userId) {
            dispatch({ type: 'SET_ERROR', payload: 'User ID is required' })
            return
        }

        dispatch({ type: 'SET_LOADING', payload: true })
        dispatch({ type: 'CLEAR_ERROR' })

        try {
            await budgetService.createYear(yearToAdd, userId)
            dispatch({ type: 'ADD_YEAR', payload: yearToAdd })
            setCurrentYear(yearToAdd)
            dispatch({ type: 'SET_SHOW_ADD_FORM', payload: false })
            dispatch({ type: 'CLEAR_ERROR' })
        } catch (err: any) {
            console.error('Error creating year:', err)
            const errorMessage = err?.response?.data?.message || 'Failed to create year'
            dispatch({ type: 'SET_ERROR', payload: errorMessage })
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false })
        }
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4 border-2 border-gray-300 rounded-md p-4">
            <h2 className="text-lg text-gray-700 font-bold">Select A Year To View The Budget</h2>
            <div className="flex items-center justify-center gap-2">
                <select 
                    id="year" 
                    value={currentYear}
                    onChange={(e) => {
                        const year = parseInt(e.target.value)
                        setCurrentYear(year)
                    }} 
                    className="border border-gray-300 rounded-md p-2"
                >
                    {state.availableYears.map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
                <button
                    onClick={() => {
                        dispatch({ type: 'TOGGLE_ADD_FORM' })
                        dispatch({ type: 'CLEAR_ERROR' })
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-md text-lg flex items-center justify-center w-10 h-10"
                    title="Add a new year"
                >
                    +
                </button>
            </div>
            {state.showAddForm && (
                <div className="flex items-center justify-center gap-2">
                    <button
                    onClick={() => dispatch({ type: 'TOGGLE_ADD_FORM' })}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-md text-lg flex items-center justify-center w-10 h-10"
                    title="Remove the new year input"
                    >
                    -
                    </button>
                    <input
                        type="number"
                        value={state.newYearInput}
                        onChange={(e) => {
                            dispatch({ type: 'SET_NEW_YEAR_INPUT', payload: e.target.value })
                        }}
                        placeholder="Enter year"
                        className="border border-gray-300 rounded-md p-2 w-32"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleAddYear()
                            }
                        }}
                        autoFocus
                    />
                    <button
                        onClick={handleAddYear}
                        disabled={state.loading}
                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-md"
                    >
                        {state.loading ? 'Adding...' : 'Add a year'}
                    </button>
                </div>
            )}
            {state.error && (
                <p className="text-red-600 text-sm">{state.error}</p>
            )}
        </div>
    )
}

export default YearDropdown