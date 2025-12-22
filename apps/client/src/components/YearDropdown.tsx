import { useState, useEffect } from 'react'
import { budgetService } from '../services/api'

const YearDropdown = ({
    currentYear, 
    setCurrentYear, 
    userId
}: {
    currentYear: number, 
    setCurrentYear: (year: number) => void,
    userId: string
}) => {
    const [availableYears, setAvailableYears] = useState<number[]>([currentYear])
    const [newYearInput, setNewYearInput] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchYears = async () => {
            if (!userId) return
            
            try {
                const response = await budgetService.getYears(userId)
                if (response.years && response.years.length > 0) {
                    setAvailableYears(response.years)
                    if (!response.years.includes(currentYear)) {
                        setCurrentYear(response.years[0])
                    }
                } else {
                    setAvailableYears([currentYear])
                }
            } catch (err: any) {
                console.error('Error fetching years:', err)
                setError('Failed to load years')
            }
        }

        fetchYears()
    }, [userId])

    const handleAddYear = async () => {
        if (!newYearInput.trim()) {
            setError('Please enter a year')
            return
        }

        const yearToAdd = parseInt(newYearInput.trim())
        
        if (isNaN(yearToAdd)) {
            setError('Please enter a valid year')
            return
        }

        if (availableYears.includes(yearToAdd)) {
            setError('This year already exists')
            return
        }

        if (!userId) {
            setError('User ID is required')
            return
        }

        setLoading(true)
        setError(null)

        try {
            await budgetService.createYear(yearToAdd, userId)
            const updatedYears = [...availableYears, yearToAdd].sort((a, b) => a - b)
            setAvailableYears(updatedYears)
            setCurrentYear(yearToAdd)
            setNewYearInput('')
        } catch (err: any) {
            console.error('Error creating year:', err)
            const errorMessage = err?.response?.data?.message || 'Failed to create year'
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex items-center justify-center gap-2">
                <label htmlFor="year" className="text-lg text-gray-700 font-bold">Year: </label>
                <select 
                    id="year" 
                    value={currentYear}
                    onChange={(e) => setCurrentYear(parseInt(e.target.value))} 
                    className="border border-gray-300 rounded-md p-2"
                >
                    {availableYears.map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>
            <div className="flex items-center justify-center gap-2">
                <input
                    type="number"
                    value={newYearInput}
                    onChange={(e) => {
                        setNewYearInput(e.target.value)
                        setError(null)
                    }}
                    placeholder="Enter year"
                    className="border border-gray-300 rounded-md p-2 w-32"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleAddYear()
                        }
                    }}
                />
                <button
                    onClick={handleAddYear}
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-md"
                >
                    {loading ? 'Adding...' : 'Add a year'}
                </button>
            </div>
            {error && (
                <p className="text-red-600 text-sm">{error}</p>
            )}
        </div>
    )
}

export default YearDropdown