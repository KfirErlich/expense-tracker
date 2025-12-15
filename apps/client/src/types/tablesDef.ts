
export type MonthlyAmount = number 
export type BudgetData = CatagoryRow[]
export const initData: MonthlyAmount[] = Array(12).fill(0)

export interface CatagoryRow {
    id: string, 
    name: string,
    year_total: MonthlyAmount,
    monthly_data: MonthlyAmount[]
}

export const MONTH_NAMES = [
    'January',
    'Fabruary',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]

export const INITIAL_INCOME_BUDGET_DATA: BudgetData = [
    { 
        id: "Salary_1_cash",
        name: "Salary #1 Cash",
         year_total: 0,
         monthly_data: initData
    },
    { 
        id: "Salary_2_cash",
        name: "Salary #2 Cash",
         year_total: 0,
         monthly_data: initData
    },
    { 
        id: "Buisness_Income",
        name: "Buisness Income",
         year_total: 0,
         monthly_data: initData
    },
    { 
        id: "Dividents",
        name: "Dividents",
         year_total: 0,
         monthly_data: initData
    },
    { 
        id: "Rental_income",
        name: "Rental Income",
         year_total: 0,
         monthly_data: initData
    },
    { 
        id: "Allowance_Scholarship",
        name: "Allowance/Scholarship",
         year_total: 0,
         monthly_data: initData
    },
    { 
        id: "Other_Incomes",
         name: "Other Incomes",
         year_total: 0,
         monthly_data: initData
    },
]
export const INITIAL_VITAL_EXPENSES_BUDGET_DATA: BudgetData = [
    { 
        id: "Morgage_Rental",
        name: "Morgage/Rental",
         year_total: 0,
         monthly_data: initData
    },
    { 
        id: "House_Bills",
        name: "House Bills (Taxes)",
         year_total: 0,
         monthly_data: initData
    },
    { 
        id: "Medical_Insurences",
        name: "Medical Insurences",
         year_total: 0,
         monthly_data: initData
    },
    { 
        id: "Public_Transportations",
        name: "Public Transportations",
         year_total: 0,
         monthly_data: initData
    },
    { 
        id: "Loan_Repayments",
        name: "Loan Repayments",
         year_total: 0,
         monthly_data: initData
    },
    { 
        id: "Other_Vitals",
        name: "Other Vitals",
         year_total: 0,
         monthly_data: initData
    },
    { 
        id: "Food_Hygiene_House_Vital",
        name: "Food/Hygiene/House-Vital",
         year_total: 0,
         monthly_data: initData
    },
    { 
        id: "Medical",
        name: "Medical",
         year_total: 0,
         monthly_data: initData
    },
    { 
        id: "Phone_Bill",
        name: "Phone Bill",
         year_total: 0,
         monthly_data: initData
    },
    { 
        id: "Service_Fees",
        name: "Service Fees",
         year_total: 0,
         monthly_data: initData
    },
    { 
        id: "Money_Withdrawal",
        name: "Money Withdrawal",
         year_total: 0,
         monthly_data: initData
    },
    { 
        id: "Urgent_House_Fixes",
        name: "Urgent House Fixes",
         year_total: 0,
         monthly_data: initData
    },
    { 
        id: "Fines",
        name: "Fines",
         year_total: 0,
         monthly_data: initData
    },
    { 
        id: "Essential_Cares",
        name: "Essential Cares (therapy, accountant, lawyer)",
         year_total: 0,
         monthly_data: initData
    },
    { 
        id: "Others_Vitals",
        name: "Others Vitals",
         year_total: 0,
         monthly_data: initData
    },
    
]

export const INITIAL_NON_VITAL_EXPENSES_BUDGET_DATA: BudgetData = [
    { 
        id: "Car_Insurence",
        name: "Car Insurence",
         year_total: 0,
         monthly_data: initData
    },
    { 
        id: "Car_Test",
        name: "Car Test",
         year_total: 0,
         monthly_data: initData
    },
    { 
        id: "Others_Insurences",
        name: "Others Insurences",
         year_total: 0,
         monthly_data: initData
    },
    { 
        id: "Professionals",
        name: "Professionals (Cleaner, Plumber)",
         year_total: 0,
         monthly_data: initData
    },
    { 
        id: "Subscriptions",
        name: "Subscriptions",
         year_total: 0,
         monthly_data: initData
    },
    { 
        id: "Donations",
        name: "Donations",
         year_total: 0,
         monthly_data: initData
    },
    { 
        id: "Application_Usages",
        name: "Application Usages",
         year_total: 0,
         monthly_data: initData
    },
    { 
        id: "Car_Expenses",
        name: "Car Expenses",
         year_total: 0,
         monthly_data: initData
    },
    { 
        id: "Restaurants_Hang_Out",
        name: "Restaurants/Hang-Out",
         year_total: 0,
         monthly_data: initData
    },
    { 
        id: "Vacations",
        name: "Vacations",
         year_total: 0,
         monthly_data: initData
    },
    { 
        id: "Shoppings",
        name: "Shoppings",
         year_total: 0,
         monthly_data: initData
    },
    { 
        id: "Presents",
        name: "Presents",
         year_total: 0,
         monthly_data: initData
    },
    { 
        id: "Pet_Cares",
        name: "Pet Cares",
         year_total: 0,
         monthly_data: initData
    },
    { 
        id: "Others_Non_Vitals",
        name: "Others Non-Vitals",
         year_total: 0,
         monthly_data: initData
    },
]
