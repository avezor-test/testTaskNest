import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import * as fs from 'fs';
import { JwtAuthGuard } from '../../src/auth/jwt/jwt-auth.guard';
import { DeadTokenGuard } from 'src/auth/jwt/dead-token.guard';
import { RandomCountryCityDto } from './dto/random-country.dto';

jest.mock('fs');

describe('UploadController', () => {
  let uploadController: UploadController;
  let uploadService: UploadService;

  const mockUploadService = {
    saveCountries: jest.fn(),
    getRandomCountry: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockDeadTokenGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        {
          provide: UploadService,
          useValue: mockUploadService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .overrideGuard(DeadTokenGuard)
      .useValue(mockDeadTokenGuard)
      .compile();

    uploadController = module.get<UploadController>(UploadController);
    uploadService = module.get<UploadService>(UploadService);
  });

  it('should be defined', () => {
    expect(uploadController).toBeDefined();
  });

  describe('uploadJsonFile', () => {
    it('should upload and process a JSON file successfully', async () => {
      const mockFile: Express.Multer.File = {
        originalname: 'test.json',
        filename: 'file-123.json',
        path: './uploads/file-123.json',
        mimetype: 'application/json',
        buffer: Buffer.from(
          JSON.stringify([{ country: 'USA', city: 'New York' }]),
        ),
        size: 100,
        fieldname: 'file',
        encoding: '7bit',
        stream: undefined,
        destination: '',
      };

      const mockData = [{ country: 'USA', city: 'New York' }];
      jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(mockData));

      const result = await uploadController.uploadJsonFile(mockFile);

      expect(result).toEqual({
        message: 'File uploaded and processed successfully',
      });
      expect(uploadService.saveCountries).toHaveBeenCalledWith(mockData);
    });

    it('should throw an error if no file is uploaded', async () => {
      await expect(uploadController.uploadJsonFile(undefined)).rejects.toThrow(
        'File upload failed',
      );
    });
  });

  describe('getRandomCountryCity', () => {
    it('should return random country and city pairs', async () => {
      const mockRandomCountry: RandomCountryCityDto[] = [
        { country: 'USA', city: 'Paris' },
        { country: 'France', city: 'New York' },
      ];

      mockUploadService.getRandomCountry.mockResolvedValue(mockRandomCountry);

      const result = await uploadController.getRandomCountryCity();

      expect(result).toEqual(mockRandomCountry);
      expect(uploadService.getRandomCountry).toHaveBeenCalled();
    });
  });
});
