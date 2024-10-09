import mongoose, { Schema, Document } from "mongoose";

interface ITransaction extends Document {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  sold: boolean;
  dateOfSale: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    sold: { type: Boolean, required: true },
    dateOfSale: { type: Date, required: true },
  },
  { timestamps: true }
);

TransactionSchema.index({ title: "text", description: "text" });

export default mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);
