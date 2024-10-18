import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DeadTokenService } from 'src/auth/dead-token.service';
import { Request } from 'express';

@Injectable()
export class DeadTokenGuard implements CanActivate {
  constructor(
    private readonly deadTokenService: DeadTokenService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header not found');
    }

    const token = authorizationHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    const isDead = await this.deadTokenService.isTokenDead(token);
    if (isDead) {
      throw new UnauthorizedException('Token is dead');
    }

    const decodedToken = this.jwtService.decode(token);
    if (!decodedToken || typeof decodedToken === 'string') {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
