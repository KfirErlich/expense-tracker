import { Router } from "express"
import { BudgetController } from "../controllers/budget.controller"

const router = Router()

router.get('/years', BudgetController.getYears)
router.post('/year', BudgetController.createYear)
router.get('/:year', BudgetController.getBudget)
router.patch('/:year', BudgetController.updateBudget )

export default router;