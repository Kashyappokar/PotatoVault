import app from './app.js'
import { env } from './config/env.js'
import logger from './utils/logger.js'
import { connectMongo } from './db/mongo.js'

const port = env.PORT || 3000

async function start() {
  await connectMongo()
  app.listen(port, () => {
    logger.info(`Server listening at http://localhost:${port}`)
  })
}

start()
