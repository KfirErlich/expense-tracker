import { Request, Response } from 'express'
import { Budget } from "../models/Budget"
import { v4 as uuidv4 } from "uuid"

import {
    INITIAL_INCOME_BUDGET_DATA, 
    INITIAL_VITAL_EXPENSES_BUDGET_DATA, 
    INITIAL_NON_VITAL_EXPENSES_BUDGET_DATA
} from '@shared'


export const BudgetController = {

    getBudget: async (req: Request, res: Response) => {
        try{
            const { year }  = req.params
            let { userId } = req.query

            if(!userId){
                userId = uuidv4();
            }
            
            let budget = await Budget.findOneAndUpdate(
                { year: parseInt(year), userId },
                { 
                  $setOnInsert: {
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
            const { year, userId, section, categoryId, newMonthlyData } = req.body

            if (!year || !userId || !section || !categoryId || !newMonthlyData) {
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
    }
}
