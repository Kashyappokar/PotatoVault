import mongoose from 'mongoose';

const dataSchema = new mongoose.Schema({
  date: { type: String, required: true, index: true },
  numberOfBags: { type: Number, required: true },
  symbol: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  remark: { type: String, required: true },
  chamber: { type: Number, required: true },
  floor: { type: Number, required: true },
  netWeight: { type: Number, required: true },
  rNumber: { type: [String], required: true },
  weighingBillNumber: { type: Number, required: true },
});

const schema = new mongoose.Schema(
  {
    farmerCode: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    stocks: { type: [dataSchema], required: true },
  },
  { timestamps: true },
);
const Stock = mongoose.model('Stock', schema);
const StockDataEntry = mongoose.model('StockDataEntry', dataSchema);

export { Stock, StockDataEntry };
