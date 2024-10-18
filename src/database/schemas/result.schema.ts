import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Result extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  isCorrect: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ResultSchema = SchemaFactory.createForClass(Result);
