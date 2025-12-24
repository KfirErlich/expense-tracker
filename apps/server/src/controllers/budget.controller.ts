import { Request, Response } from 'express'
import { Budget } from "../models/Budget"

import {
    INITIAL_INCOME_BUDGET_DATA, 
    INITIAL_VITAL_EXPENSES_BUDGET_DATA, 
    INITIAL_NON_VITAL_EXPENSES_BUDGET_DATA
} from 'shared'


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

            res.json({ budget, userId })
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

            sectionArray[categoryIndex].monthly_data = newMonthlyData;
            sectionArray[categoryIndex].year_total = newTotal;

            await budget.save();

            res.json({ budget, userId });
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

            res.json({ budget, userId });
        } catch (error) {
            console.error("Error creating year:", error);
            res.status(500).json({ message: "Error creating year" });
        }
    }
}
