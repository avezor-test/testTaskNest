// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Country, CountrySchema } from './schemas/country.schema';
import { User, UserSchema } from './schemas/user.schema';
import { Result, ResultSchema } from './schemas/result.schema';
import { DeadToken, DeadTokenSchema } from './schemas/dead-token.schema';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    MongooseModule.forFeature([
      { name: Country.name, schema: CountrySchema },
      { name: User.name, schema: UserSchema },
      { name: Result.name, schema: ResultSchema },
      { name: DeadToken.name, schema: DeadTokenSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
