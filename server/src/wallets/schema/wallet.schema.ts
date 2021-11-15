import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WalletDocument = Wallet & Document;

@Schema({ _id: false })
export class Wallet {
  @Prop()
  _id: string;
  
  @Prop()
  data: string;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
