/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { DeadTokenService } from './dead-token.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private deadTokenService: DeadTokenService,
  ) {}

  private async comparePassword(
    enteredPassword: string,
    storedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(enteredPassword, storedPassword);
  }

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findOneByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    return this.userService.createUser(createUserDto);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (user && (await this.comparePassword(pass, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
    };
  }

  async logout(email: string, token: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const decodedToken = this.jwtService.decode(token);
    if (!decodedToken || typeof decodedToken === 'string') {
      throw new UnauthorizedException('Invalid token');
    }

    const expirationDate = new Date(decodedToken.exp * 1000);

    await this.deadTokenService.addDeadToken(token, expirationDate);
  }

  async changePassword(email: string, newPassword: string) {
    await this.userService.updatePassword(email, newPassword);
  }

  async isTokenDead(token: string): Promise<boolean> {
    return this.deadTokenService.isTokenDead(token);
  }
}
