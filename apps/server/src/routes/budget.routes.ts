import { Router } from "express"
import { BudgetController } from "../controllers/budget.controller"

const router = Router()

router.get('/:year', BudgetController.getBudget)
router.patch('/:year', BudgetController.updateBudget )

export default router;