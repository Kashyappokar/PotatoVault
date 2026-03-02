import { z } from 'zod'
import * as StocksService from '../services/stocks.service.js'
import ApiResponse from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiErrors.js'
import asyncHandler from '../utils/asyncHandler.js'

const CreateSchema = z.object({
  symbol: z.string().min(1),
  name: z.string().min(2),
  price: z.number().nonnegative()
})

const UpdateSchema = z.object({
  symbol: z.string().min(1).optional(),
  name: z.string().min(2).optional(),
  price: z.number().nonnegative().optional()
})

export const list = asyncHandler(async (req, res) => {
  const rows = await StocksService.list()
  res.json(ApiResponse.success(rows))
})

export const get = asyncHandler(async (req, res) => {
  const id = req.params.id
  const row = await StocksService.get(id)
  if (!row) throw ApiError.notFound('Stock not found')
  res.json(ApiResponse.success(row))
})

export const create = asyncHandler(async (req, res) => {
  const data = CreateSchema.parse(req.body)
  const row = await StocksService.create(data)
  res.status(201).json(ApiResponse.created(row))
})

export const update = asyncHandler(async (req, res) => {
  const id = req.params.id
  const data = UpdateSchema.parse(req.body)
  const row = await StocksService.update(id, data)
  if (!row) throw ApiError.notFound('Stock not found')
  res.json(ApiResponse.success(row))
})

export const remove = asyncHandler(async (req, res) => {
  const id = req.params.id
  const row = await StocksService.remove(id)
  if (!row) throw ApiError.notFound('Stock not found')
  res.status(204).json(ApiResponse.noContent())
})
