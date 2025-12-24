
import { Schema, model, Document } from 'mongoose';

const categoryRowSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  year_total: { type: Number, default: 0 },
  monthly_data: { 
    type: [Number], 
    default: Array(12).fill(0) 
  }
});

export interface IBudget extends Document {
  year: number;
  userId: string;
  userName: string;
  income: any[];
  vital: any[];
  nonVital: any[];
}


const budgetSchema = new Schema<IBudget>({
  year: { type: Number, required: true },
  userId: { type: String, required: true },
  userName: {type: String, require: true},
  income: [categoryRowSchema],
  vital: [categoryRowSchema],
  nonVital: [categoryRowSchema],
}, { timestamps: true });

budgetSchema.index({userId: 1, year: 1 }, { unique: true })

export const Budget = model<IBudget>('Budget', budgetSchema);