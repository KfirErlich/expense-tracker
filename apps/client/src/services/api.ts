import axios from 'axios'
import { getAuth } from 'firebase/auth'

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const api = axios.create({
    baseURL: API_URL
})

api.interceptors.request.use(async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const budgetService = {
    getBudget: async(year: number) => {
        const response = await api.get(`/budget/${year}`, {
            params: {
                year
            }
        })
        return response.data;
    },
    updateBudget: async (
        year: number,
        section: 'income' | 'vital' | 'nonVital',
        categoryId: string,
        newMonthlyData: number[]
    ) => {
        const response = await api.patch(`/budget/${year}`, {
            year,
            section,
            categoryId,
            newMonthlyData
        })
        return response.data;
    },
    getYears: async () => {
        const response = await api.get(`/budget/years`)
        return response.data;
    },
    createYear: async (year: number) => {
        const response = await api.post(`/budget/year`, {
            year,
        })
        return response.data;
    }
}