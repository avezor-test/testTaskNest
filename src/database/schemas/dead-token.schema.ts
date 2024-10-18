import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class DeadToken extends Document {
  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  expirationDate: Date;
}

export const DeadTokenSchema = SchemaFactory.createForClass(DeadToken);
