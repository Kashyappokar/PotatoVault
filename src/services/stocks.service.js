import { Stock } from '../models/stock.model.js';
import { ApiError } from '../utils/ApiErrors.js';
import { parseDateIST, formatDateIST } from '../utils/helper/date.helper.js';
import logger from '../utils/logger.js';
import { User } from '../models/user.model.js';
// Controller handles validation with zod; service focuses on normalization and persistence.

export async function list() {
  return Stock.find().sort({ symbol: 1 });
}

export async function get(farmerCode) {
  const stock = await Stock.find({
    farmerCode,
  });

  if (!stock) {
    logger.error('Stock not found for farmerCode:', farmerCode);
    throw ApiError.notFound('Stock not found');
  }
  return stock;
}

export async function create(data) {
  try {
    const [validFarmerCode, existingStock] = await Promise.all([
      User.findOne({
        farmerCode: data.farmerCode,
      }),
      Stock.findOne({
        farmerCode: data.farmerCode,
      }),
    ]);

    if (!validFarmerCode) {
      logger.error('Invalid farmerCode:', data.farmerCode);
      throw ApiError.badRequest('Invalid farmerCode');
    }

    if (!existingStock) {
      if (!data.stocks || data.stocks.length === 0) {
        logger.error('No stock data entries provided');
        throw ApiError.badRequest('At least one stock data entry is required');
      }

      if (data.date) {
        const parsed = parseDateIST(data.date, 'DD-MM-YYYY');
        if (!parsed) {
          logger.error('Invalid date passing:', data.date);
          throw ApiError.badRequest(
            'Invalid date format. Please use DD-MM-YYYY.',
          );
        }
        data.date = formatDateIST(parsed, 'DD-MM-YYYY');
      }

      const stock = await Stock.create(data);
      return stock;
    }

    const stockDataEntries = data.stocks;
    existingStock.stocks.push(...stockDataEntries);
    await existingStock.save();
    return existingStock;
  } catch (error) {
    logger.error('Error creating stock:', error);
    throw error;
  }
}

export async function update(id, data) {
  return Stock.findByIdAndUpdate(id, data, { new: true });
}

export async function remove(id) {
  return Stock.findByIdAndDelete(id);
}
