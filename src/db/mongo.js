import mongoose from 'mongoose';
import logger from '../utils/logger.js';
import { env } from '../config/env.js';

export async function connectMongo() {
  await mongoose.connect(env.MONGO_URL, {
    autoIndex: env.NODE_ENV !== 'production',
  });
  logger.info('MongoDB connected');
  await ensureIndexes();
}

async function ensureIndexes() {
  try {
    const coll = mongoose.connection.collection('stocks');
    const indexes = await coll.indexes();
    const symbolIdx = indexes.find((i) => i.key && i.key.symbol === 1);
    if (symbolIdx && symbolIdx.unique) {
      await coll.dropIndex(symbolIdx.name || 'symbol_1');
      logger.warn('Dropped unique index on stocks.symbol');
    }
  } catch (err) {
    logger.error({ err }, 'Index check failed');
  }
}
