import axios from 'axios'

const API_URL = "http://localhost:3001/api"
const DEV_USER_ID = "kfir-dev-1"

export const budgetService = {
    getBudget: async( year: number) => {
        const response = await axios.get(`${API_URL}/budget/${year}`, {
            params: {
                userId: DEV_USER_ID
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
    }
}