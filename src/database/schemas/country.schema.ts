import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Country extends Document {
  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  city: string;
}

export const CountrySchema = SchemaFactory.createForClass(Country);