import { Stock } from "../models/stock.model.js";

export async function list() {
  return Stock.find().sort({ symbol: 1 });
}

export async function get(id) {
  return Stock.findById(id);
}

export async function create(data) {
  return Stock.create(data);
}

export async function update(id, data) {
  return Stock.findByIdAndUpdate(id, data, { new: true });
}

export async function remove(id) {
  return Stock.findByIdAndDelete(id);
}
