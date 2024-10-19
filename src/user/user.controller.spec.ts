/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { DeadTokenGuard } from 'src/auth/jwt/dead-token.guard';
import { CheckResultDto } from './dto/check-result.dto';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    checkAndSaveResult: jest.fn(),
    getUserResults: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockDeadTokenGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .overrideGuard(DeadTokenGuard)
      .useValue(mockDeadTokenGuard)
      .compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('checkAndSaveResult', () => {
    it('should check and save result', async () => {
      const email = 'test@example.com';
      const country = 'USA';
      const city = 'New York';

      const mockResult: CheckResultDto = {
        isCorrect: true,
      };

      mockUserService.checkAndSaveResult.mockResolvedValue(mockResult);

      const result = await userController.checkAndSaveResult(
        email,
        country,
        city,
        null,
      );

      expect(result).toEqual(mockResult);
      expect(mockUserService.checkAndSaveResult).toHaveBeenCalledWith(
        email,
        country,
        city,
      );
    });
  });

  describe('getUserResults', () => {
    it('should return paginated user results', async () => {
      const email = 'test@example.com';
      const page = 1;
      const limit = 10;

      const mockResults = {
        results: [{ country: 'USA', city: 'New York', isCorrect: true }],
        totalCount: 1,
      };

      mockUserService.getUserResults.mockResolvedValue(mockResults);

      const result = await userController.getUserResults(
        email,
        page,
        limit,
        null,
        null,
        null,
      );

      expect(result).toEqual(mockResults);
      expect(mockUserService.getUserResults).toHaveBeenCalledWith(
        email,
        page,
        limit,
        null,
        null,
      );
    });
  });
});
