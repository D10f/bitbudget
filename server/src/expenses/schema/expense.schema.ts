import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ExpenseDocument = Expense & Document;

@Schema({ _id: false })
export class Expense {
  @Prop()
  _id: string;
  
  @Prop()
  data: string;

  @Prop()
  walletId: string;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);