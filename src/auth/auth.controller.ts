import {
  Controller,
  Post,
  Body,
  UseGuards,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiChangePassword,
  ApiLogin,
  ApiLogout,
  ApiRegister,
} from 'decorators/api/auth.decorators';
import { LoginDto } from 'src/user/dto/login.dto';
import { DeadTokenGuard } from './jwt/dead-token.guard';
import { CheckUserMatch } from 'decorators/checkUserMatch.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiRegister()
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    await this.authService.register(createUserDto);
    return { message: 'User successfully registered' };
  }

  @Post('login')
  @ApiLogin()
  async login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    const { email, password } = loginDto;
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard, DeadTokenGuard)
  @Post('logout')
  @ApiLogout()
  async logout(
    @Req() req: Request,
    @Body('email') email: string,
    @CheckUserMatch() _: void,
  ): Promise<{ message: string }> {
    const authorization = req.headers['authorization'];
    if (!authorization) {
      throw new UnauthorizedException('Authorization header not found');
    }
    const token = authorization.split(' ')[1];
    await this.authService.logout(email, token);
    return { message: 'Successful logout' };
  }

  @UseGuards(JwtAuthGuard, DeadTokenGuard)
  @Post('change-password')
  @ApiChangePassword()
  async changePassword(
    @Body('newPassword') newPassword: string,
    @Body('email') email: string,
    @CheckUserMatch() _: void,
  ): Promise<{ message: string }> {
    await this.authService.changePassword(email, newPassword);
    return { message: 'Password successfully changed' };
  }
}
