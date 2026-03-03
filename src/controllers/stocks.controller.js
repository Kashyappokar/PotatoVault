import { z } from 'zod';
import * as StocksService from '../services/stocks.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiErrors.js';
import asyncHandler from '../utils/asyncHandler.js';

const StockDataEntrySchema = z.object({
  date: z.string().min(1),
  numberOfBags: z.number().nonnegative(),
  symbol: z.string().min(1),
  vehicleNumber: z.string().min(1),
  remark: z.string().min(1),
  chamber: z.number().nonnegative(),
  floor: z.number().nonnegative(),
  netWeight: z.number().nonnegative(),
  rNumber: z.array(z.string()),
  weighingBillNumber: z.number().nonnegative(),
});

const StockSchema = z.object({
  farmerCode: z.string().min(1),
  name: z.string().min(1),
  address: z.string().min(1),
  phone: z.string().min(10).max(10, 'Phone number must be 10 digits'),
  stocks: z.array(StockDataEntrySchema).min(1),
});

const UpdateSchema = z.object({
  date: z
    .string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, 'Invalid date format, expected DD-MM-YYYY')
    .optional(),
  name: z.string().min(2).optional(),
  address: z.string().min(2).optional(),
  stockIn: z.number().nonnegative().optional(),
  phone: z.string().min(10).max(10).optional(),
  symbol: z.string().min(1).optional(),
  vehicleNumber: z.string().optional(),
  weighingBillNumber: z.number().nonnegative().optional(),
  remark: z.string().optional(),
  chamber: z.number().nonnegative().optional(),
  floor: z.number().nonnegative().optional(),
  netWeight: z.number().nonnegative().optional(),
  rNumber: z.array(z.string()).optional(),
});

export const list = asyncHandler(async (req, res) => {
  const rows = await StocksService.list();
  res.json(ApiResponse.success(rows));
});

export const get = asyncHandler(async (req, res) => {
  const farmerCode = req.params.farmerCode;
  const row = await StocksService.get(farmerCode);
  if (!row) throw ApiError.notFound('Stock not found');
  res.json(ApiResponse.success(row));
});

export const create = asyncHandler(async (req, res) => {
  const data = StockSchema.safeParse(req.body);
  if (!data.success) throw ApiError.badRequest(data.error.message);
  const row = await StocksService.create(data.data);
  res.status(201).json(ApiResponse.created(row, 'Stock created successfully'));
});

export const update = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const data = UpdateSchema.parse(req.body);
  const row = await StocksService.update(id, data);
  if (!row) throw ApiError.notFound('Stock not found');
  res.json(ApiResponse.success(row));
});

export const remove = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const row = await StocksService.remove(id);
  if (!row) throw ApiError.notFound('Stock not found');
  res.status(204).json(ApiResponse.noContent());
});
