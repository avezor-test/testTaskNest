import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';
import { DeadTokenService } from './dead-token.service';
import { AuthController } from './auth.controller';
import { DeadTokenGuard } from './jwt/dead-token.guard';

@Global()
@Module({
  imports: [
    UserModule,
    PassportModule,
    DatabaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, DeadTokenService, DeadTokenGuard],
  exports: [AuthService, JwtModule, DeadTokenService, DeadTokenGuard],
})
export class AuthModule {}
