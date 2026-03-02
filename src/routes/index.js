import { Router } from 'express'
import authRoutes from './auth.routes.js'
import stockRoutes from './stocks.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/stocks', stockRoutes)

export default router
