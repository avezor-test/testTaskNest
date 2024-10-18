import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Result extends Document {
  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  userId: string; // Reference to User
}

export const ResultSchema = SchemaFactory.createForClass(Result);
