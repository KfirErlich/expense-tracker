import { Request, Response } from 'express'
import { Budget } from "../models/Budget"

import {
    INITIAL_INCOME_BUDGET_DATA, 
    INITIAL_VITAL_EXPENSES_BUDGET_DATA, 
    INITIAL_NON_VITAL_EXPENSES_BUDGET_DATA,
    type CatagoryRow
} from 'shared'

// Helper function to ensure category names are present
const ensureCategoryNames = (categories: any[], initialData: CatagoryRow[]): any[] => {
    return categories.map((cat: any) => {
        if (!cat.name) {
            const initialCategory = initialData.find(init => init.id === cat.id);
            if (initialCategory) {
                return { ...cat, name: initialCategory.name };
            }
        }
        return cat;
    });
}

// Helper function to ensure category names are present on Mongoose document before saving
const ensureCategoryNamesOnDocument = (budget: any) => {
    const initialDataMap: Record<string, CatagoryRow[]> = {
        income: INITIAL_INCOME_BUDGET_DATA,
        vital: INITIAL_VITAL_EXPENSES_BUDGET_DATA,
        nonVital: INITIAL_NON_VITAL_EXPENSES_BUDGET_DATA
    };

    ['income', 'vital', 'nonVital'].forEach((section) => {
        const sectionArray = budget[section] as any[];
        const initialData = initialDataMap[section];
        
        if (sectionArray && Array.isArray(sectionArray)) {
            sectionArray.forEach((cat: any, index: number) => {
                if (!cat.name) {
                    const initialCategory = initialData.find(init => init.id === cat.id);
                    if (initialCategory) {
                        cat.name = initialCategory.name;
                    }
                }
            });
        }
    });
}

// Helper function to serialize budget document and ensure all category names are present
const serializeBudget = (budget: any): any => {
    if (!budget) {
        return null;
    }
    
    const budgetObject = budget.toObject();
    
    // Ensure category names are present (handles legacy data)
    budgetObject.income = ensureCategoryNames(budgetObject.income || [], INITIAL_INCOME_BUDGET_DATA);
    budgetObject.vital = ensureCategoryNames(budgetObject.vital || [], INITIAL_VITAL_EXPENSES_BUDGET_DATA);
    budgetObject.nonVital = ensureCategoryNames(budgetObject.nonVital || [], INITIAL_NON_VITAL_EXPENSES_BUDGET_DATA);
    
    return budgetObject;
}


export const BudgetController = {

    getBudget: async (req: Request, res: Response) => {
        try{
            const { year }  = req.params
            const { userName } = req.query;
            const userId = (req as any).user?.uid;

            if (!userId) {
                return res.status(401).json({ message: "User not authenticated" });
            }
            
            let budget = await Budget.findOneAndUpdate(
                { year: parseInt(year), userId },
                { 
                  $setOnInsert: {
                    userName: userName || 'Unknown User',
                    income: INITIAL_INCOME_BUDGET_DATA,
                    vital: INITIAL_VITAL_EXPENSES_BUDGET_DATA,
                    nonVital: INITIAL_NON_VITAL_EXPENSES_BUDGET_DATA
                  }
                },
                { 
                  upsert: true, 
                  new: true,
                  setDefaultsOnInsert: true 
                }
              );

            const budgetObject = serializeBudget(budget);
            res.json({ budget: budgetObject, userId });
        } catch(error) {
            res.status(500).json({ message: "Error fetching budget" });
        }
    },
    updateBudget: async (req: Request, res: Response) => {
        try {
            const { year: yearParam } = req.params;
            const { section, categoryId, newMonthlyData } = req.body;
            
            const userId = (req as any).user?.uid;

            if (!userId) {
                return res.status(401).json({ message: "User not authenticated" });
            }

            const year = yearParam || req.body.year;

            if (!year || !section || !categoryId || !newMonthlyData) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            const validSections = ['income', 'vital', 'nonVital'];
            if (!validSections.includes(section)) {
                return res.status(400).json({ message: "Invalid section. Must be 'income', 'vital', or 'nonVital'" });
            }

            const newTotal = newMonthlyData.reduce((a: number, b: number) => a + b, 0);

            const budget = await Budget.findOne({ year: parseInt(year), userId });

            if (!budget) {
                return res.status(404).json({ message: "Budget not found" });
            }

            const sectionArray = budget[section as keyof typeof budget] as any[];
            const categoryIndex = sectionArray.findIndex((cat: any) => cat.id === categoryId);

            if (categoryIndex === -1) {
                return res.status(404).json({ message: "Category not found" });
            }

            // Ensure the name field is preserved before updating
            const category = sectionArray[categoryIndex];
            if (!category.name) {
                const initialDataMap: Record<string, CatagoryRow[]> = {
                    income: INITIAL_INCOME_BUDGET_DATA,
                    vital: INITIAL_VITAL_EXPENSES_BUDGET_DATA,
                    nonVital: INITIAL_NON_VITAL_EXPENSES_BUDGET_DATA
                };
                const initialCategory = initialDataMap[section].find(init => init.id === categoryId);
                if (initialCategory) {
                    category.name = initialCategory.name;
                }
            }

            category.monthly_data = newMonthlyData;
            category.year_total = newTotal;

            // Ensure all category names are present before saving
            ensureCategoryNamesOnDocument(budget);

            await budget.save();

            const budgetObject = serializeBudget(budget);
            res.json({ budget: budgetObject, userId });
        } catch (error) {
            console.error("Error updating budget:", error);
            res.status(500).json({ message: "Error updating budget" });
        }
    },
    getYears: async (req: Request, res: Response) => {
        try {
            // Extract userId from authenticated user token
            const userId = (req as any).user?.uid;

            if (!userId) {
                return res.status(401).json({ message: "User not authenticated" });
            }

            const years = await Budget.distinct('year', { userId });
            const sortedYears = years.sort((a, b) => b - a);

            res.json({ years: sortedYears });
        } catch (error) {
            console.error("Error fetching years:", error);
            res.status(500).json({ message: "Error fetching years" });
        }
    },
    createYear: async (req: Request, res: Response) => {
        try {
            const { year, userName } = req.body;
            
            const userId = (req as any).user?.uid;

            if (!year) {
                return res.status(400).json({ message: "year is required" });
            }

            if (!userId) {
                return res.status(401).json({ message: "User not authenticated" });
            }

            const existingBudget = await Budget.findOne({ year: parseInt(year), userId });
            if (existingBudget) {
                return res.status(409).json({ message: "Budget for this year already exists" });
            }

            const budget = await Budget.create({
                year: parseInt(year),
                userName: userName || 'Unknown User',
                userId,
                income: INITIAL_INCOME_BUDGET_DATA,
                vital: INITIAL_VITAL_EXPENSES_BUDGET_DATA,
                nonVital: INITIAL_NON_VITAL_EXPENSES_BUDGET_DATA
            });

            const budgetObject = serializeBudget(budget);
            res.json({ budget: budgetObject, userId });
        } catch (error) {
            console.error("Error creating year:", error);
            res.status(500).json({ message: "Error creating year" });
        }
    }
}
