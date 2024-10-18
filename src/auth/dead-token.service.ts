import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeadToken } from '../database/schemas/dead-token.schema';

@Injectable()
export class DeadTokenService {
  constructor(
    @InjectModel(DeadToken.name) private deadTokenModel: Model<DeadToken>,
  ) {}

  async addDeadToken(token: string, expirationDate: Date): Promise<DeadToken> {
    const newDeadToken = new this.deadTokenModel({ token, expirationDate });
    return newDeadToken.save();
  }

  async isTokenDead(token: string): Promise<boolean> {
    const deadToken = await this.deadTokenModel
      .findOne({
        token,
        expirationDate: { $gt: new Date() },
      })
      .exec();
    return !!deadToken;
  }

  async removeExpiredDeadTokens(): Promise<void> {
    await this.deadTokenModel
      .deleteMany({
        expirationDate: { $lt: new Date() },
      })
      .exec();
  }
}
