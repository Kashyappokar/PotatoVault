import { z } from "zod";
import * as StocksService from "../services/stocks.service.js";

const CreateSchema = z.object({
  symbol: z.string().min(1),
  name: z.string().min(2),
  price: z.number().nonnegative(),
});

const UpdateSchema = z.object({
  symbol: z.string().min(1).optional(),
  name: z.string().min(2).optional(),
  price: z.number().nonnegative().optional(),
});

export async function list(req, res) {
  const rows = await StocksService.list();
  res.json(rows);
}

export async function get(req, res, next) {
  try {
    const id = req.params.id;
    const row = await StocksService.get(id);
    if (!row) return res.status(404).json({ error: "not_found" });
    res.json(row);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const data = CreateSchema.parse(req.body);
    const row = await StocksService.create(data);
    res.status(201).json(row);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const id = req.params.id;
    const data = UpdateSchema.parse(req.body);
    const row = await StocksService.update(id, data);
    res.json(row);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const id = req.params.id;
    await StocksService.remove(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
