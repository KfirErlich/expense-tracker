import { Router } from "express"
import { BudgetController } from "../controllers/budget.controller"
import { verifyToken } from '../middleware/authMiddleware';

const router = Router()

router.get('/years',verifyToken, BudgetController.getYears)
router.post('/year',verifyToken, BudgetController.createYear)
router.get('/:year',verifyToken, BudgetController.getBudget)
router.patch('/:year',verifyToken, BudgetController.updateBudget )

export default router;