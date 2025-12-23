import axios from 'axios'

const API_URL = "http://localhost:3001/api"

export const budgetService = {
    getBudget: async(year: number, userId: string) => {
        const response = await axios.get(`${API_URL}/budget/${year}`, {
            params: {
                userId,
                year
            }
        })
        return response.data;
    },
    updateBudget: async (
        year: number,
        userId: string,
        section: 'income' | 'vital' | 'nonVital',
        categoryId: string,
        newMonthlyData: number[]
    ) => {
        const response = await axios.patch(`${API_URL}/budget/${year}`, {
            year,
            userId,
            section,
            categoryId,
            newMonthlyData
        })
        return response.data;
    },
    getYears: async (userId: string) => {
        const response = await axios.get(`${API_URL}/budget/years`, {
            params: {
                userId
            }
        })
        return response.data;
    },
    createYear: async (year: number, userId: string) => {
        const response = await axios.post(`${API_URL}/budget/year`, {
            year,
            userId
        })
        return response.data;
    }
}