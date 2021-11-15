import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';
import { IExpenseUpdate } from './interfaces/expense-update.interface';
import { Expense, ExpenseDocument } from './schema/expense.schema';

@Injectable()
export class ExpensesRepository {
  constructor(
    @InjectModel(Expense.name)
    private readonly expenseModel: Model<ExpenseDocument>,
  ) {}

  async create(expense: Expense): Promise<ExpenseDocument> {
    return await this.expenseModel.create(expense);
  }

  async findAll(): Promise<ExpenseDocument[]> {
    return await this.expenseModel.find({});
  }

  async findOne(id: string, options?: QueryOptions): Promise<ExpenseDocument> {
    return await this.expenseModel.findById(id, null, options);
  }

  async update(id: string, updates: IExpenseUpdate): Promise<ExpenseDocument> {
    return await this.expenseModel.findByIdAndUpdate(id, updates);
  }

  async remove(id: string): Promise<ExpenseDocument> {
    return await this.expenseModel.findByIdAndDelete(id);
  }

  async removeExpenses(expenseIds: string[]): Promise<void> {
    console.log(expenseIds);
    const result = await this.expenseModel.deleteMany({ _id: { $in: expenseIds }});
    console.log(result);
  }
}
