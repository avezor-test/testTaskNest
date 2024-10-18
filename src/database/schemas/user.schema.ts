import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Result } from './result.schema';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  country: string;

  results: Result[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('results', {
  ref: 'Result',
  localField: 'email',
  foreignField: 'email',
});

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

UserSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();

  if (update && typeof (update as any).password === 'string') {
    const salt = await bcrypt.genSalt(10);
    (update as any).password = await bcrypt.hash(
      (update as any).password,
      salt,
    );
    this.setUpdate(update);
  }

  next();
});
