import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import pinoHttp from 'pino-http'
import logger from './utils/logger.js'
import routes from './routes/index.js'
import { errorHandler } from './middleware/error.js'
import { env } from './config/env.js'
import { ApiError } from './utils/ApiErrors.js'

const app = express()

app.use(helmet())
app.use(
  cors({
    origin: env.CORS_ORIGIN || '*',
    credentials: true
  })
)
app.use(express.json({ limit: '1mb' }))
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 100
  })
)
app.use(
  pinoHttp({
    logger,
    customLogLevel: function (res, err) {
      if (res.statusCode >= 500 || err) return 'error'
      if (res.statusCode >= 400) return 'warn'
      return 'info'
    }
  })
)

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api', routes)
app.use((req, res, next) => {
  next(ApiError.notFound(`Route ${req.method} ${req.path} not found`))
})
app.use(errorHandler)

export default app
