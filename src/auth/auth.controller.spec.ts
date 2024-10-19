/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { DeadTokenGuard } from './jwt/dead-token.guard';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from 'src/user/dto/login.dto';
import { DeadTokenService } from './dead-token.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    validateUser: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    changePassword: jest.fn(),
  };

  const mockDeadTokenGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  const mockJwtService = {
    sign: jest.fn(),
    decode: jest.fn(),
    verify: jest.fn(),
  };

  const mockDeadTokenService = {
    isTokenDead: jest.fn(),
    addDeadToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: DeadTokenGuard,
          useValue: mockDeadTokenGuard,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: DeadTokenService,
          useValue: mockDeadTokenService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      mockAuthService.register.mockResolvedValue(undefined);

      const result = await authController.register(createUserDto);

      expect(result).toEqual({ message: 'User successfully registered' });
      expect(mockAuthService.register).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('login', () => {
    it('should login a user and return access token', async () => {
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'password123',
      };

      mockAuthService.validateUser.mockResolvedValue({
        id: 'user-id',
        email: 'john@example.com',
      });
      mockAuthService.login.mockResolvedValue({ access_token: 'test-token' });

      const result = await authController.login(loginDto);

      expect(result).toEqual({ access_token: 'test-token' });
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      expect(mockAuthService.login).toHaveBeenCalledWith({
        id: 'user-id',
        email: 'john@example.com',
      });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const loginDto: LoginDto = {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      };

      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(authController.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logout', () => {
    it('should logout the user and return a success message', async () => {
      const req = {
        headers: { authorization: 'Bearer test-token' },
      } as any;
      const email = 'john@example.com';

      mockAuthService.logout.mockResolvedValue(undefined);

      const result = await authController.logout(req, email);

      expect(result).toEqual({ message: 'Successful logout' });
      expect(mockAuthService.logout).toHaveBeenCalledWith(email, 'test-token');
    });

    it('should throw UnauthorizedException if no authorization header is found', async () => {
      const req = {
        headers: {},
      } as any;
      const email = 'john@example.com';

      await expect(authController.logout(req, email)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('change-password', () => {
    it('should change the user password and return a success message', async () => {
      const email = 'john@example.com';
      const newPassword = 'newpassword123';

      mockAuthService.changePassword.mockResolvedValue(undefined);

      const result = await authController.changePassword(newPassword, email);

      expect(result).toEqual({ message: 'Password successfully changed' });
      expect(mockAuthService.changePassword).toHaveBeenCalledWith(
        email,
        newPassword,
      );
    });
  });
});
