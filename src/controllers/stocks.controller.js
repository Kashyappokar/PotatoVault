import { z } from 'zod';
import * as StocksService from '../services/stocks.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiErrors.js';
import asyncHandler from '../utils/asyncHandler.js';
import logger from '../utils/logger.js';

const StockDataEntrySchema = z.object({
  date: z.string().nonempty('Date is required'),
  numberOfBags: z.number().min(1).nonnegative(),
  symbol: z.string().nonempty('Symbol is required'),
  vehicleNumber: z
    .string()
    .nonempty('Vehicle number is required')
    .length(10, 'Vehicle number must be 10 digits'),
  remark: z.string().nonempty('Remark is required'),
  chamber: z.number().min(1).nonnegative(),
  floor: z.number().min(1).nonnegative(),
  netWeight: z.number().min(1).nonnegative(),
  rNumber: z.array(z.string()).optional(),
  weighingBillNumber: z.number().min(1).nonnegative(),
});

const StockSchema = z.object({
  farmerCode: z.string().min(1),
  stocks: z
    .array(StockDataEntrySchema, {
      message: 'Only Array of Stock Data Entries is allowed',
    })
    .nonempty('At least one stock data entry is required'),
});

const UpdateSchema = z.object({
  date: z.string().min(1).optional(),
  numberOfBags: z.number().nonnegative().optional(),
  symbol: z.string().min(1).optional(),
  vehicleNumber: z
    .string()
    .length(10, 'Vehicle number must be 10 digits')
    .optional(),
  weighingBillNumber: z.number().nonnegative().optional(),
  remark: z.string().min(1).optional(),
  chamber: z.number().nonnegative().optional(),
  floor: z.number().nonnegative().optional(),
  netWeight: z.number().nonnegative().optional(),
  rNumber: z.array(z.string()).optional(),
});

export const list = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user.farmerCode) {
    logger.error('farmerCode is required');
    throw ApiError.badRequest('farmerCode is required');
  }
  const rows = await StocksService.list(user.farmerCode);
  logger.info(
    `Stocks found for farmerCode: ${user.farmerCode}, stocks: ${rows}`,
  );
  res.json(ApiResponse.success(rows));
});

export const get = asyncHandler(async (req, res) => {
  const user = req.user;
  if (user && user.role !== 'admin') {
    logger.error(
      `Unauthorized access attempt by user: ${JSON.stringify(user)}`,
    );
    throw ApiError.unauthorized('Unauthorized access to get stock details');
  }

  const farmerCode = req.params.farmerCode;
  const row = await StocksService.get(farmerCode);
  if (!row) {
    logger.error(`Stock not found for farmerCode: ${farmerCode}`);
    throw ApiError.notFound('Stock not found');
  }
  logger.info(`Stock found for farmerCode: ${farmerCode}, stock: ${row}`);
  res.json(ApiResponse.success(row));
});

export const create = asyncHandler(async (req, res) => {
  const user = req.user;
  if (user && user.role !== 'admin') {
    logger.error(
      `Unauthorized access attempt by user: ${JSON.stringify(user)}`,
    );
    throw ApiError.unauthorized('Unauthorized access to create stock');
  }
  const data = StockSchema.safeParse(req.body);
  if (!data.success) {
    logger.error('Invalid stock data:', data.error);
    throw data.error;
  }
  const row = await StocksService.create(data?.data);
  res.status(201).json(ApiResponse.created(row, 'Stock created successfully'));
});

export const update = asyncHandler(async (req, res) => {
  const user = req.user;
  if (user && user.role !== 'admin') {
    logger.error(
      `Unauthorized access attempt by user: ${JSON.stringify(user)}`,
    );
    throw ApiError.unauthorized('Unauthorized access to update stock');
  }

  const id = req.params.id;
  const data = UpdateSchema.safeParse(req.body);
  if (!data.success) {
    logger.error('Invalid update data:', data.error);
    throw data.error;
  }
  const row = await StocksService.update(id, data?.data);
  if (!row) throw ApiError.notFound('Stock not found');
  res.json(ApiResponse.success(row));
});

export const remove = asyncHandler(async (req, res) => {
  const user = req.user;
  if (user && user.role !== 'admin') {
    logger.error(
      `Unauthorized access attempt by user: ${JSON.stringify(user)}`,
    );
    throw ApiError.unauthorized('Unauthorized access to remove stock');
  }

  const id = req.params.id;
  const row = await StocksService.remove(id);
  if (!row) throw ApiError.notFound('Stock not found');
  res.status(204).json(ApiResponse.noContent());
});
