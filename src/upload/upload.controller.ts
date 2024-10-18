import { Controller, Post, UseGuards, UploadedFile, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../../src/auth/jwt/jwt-auth.guard';
import { UploadService } from './upload.service';
import * as fs from 'fs';
import { UploadJsonFile } from 'decorators/upload-json.decorator';
import {
  ApiGetRandomCountry,
  ApiUploadJsonFile,
} from 'decorators/api/upload.decorators';
import { ApiTags } from '@nestjs/swagger';
import { DeadTokenGuard } from 'src/auth/jwt/dead-token.guard';
import { RandomCountryCityDto } from './dto/random-country.dto';

@ApiTags('Upload')
@Controller('upload')
@UseGuards(JwtAuthGuard, DeadTokenGuard)
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('json')
  @UploadJsonFile()
  @ApiUploadJsonFile()
  async uploadJsonFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ message: string }> {
    if (!file) {
      throw new Error('File upload failed');
    }

    const filePath = `./uploads/${file.filename}`;

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);

    await this.uploadService.saveCountries(data);

    return { message: 'File uploaded and processed successfully' };
  }

  @Get('countries')
  @ApiGetRandomCountry()
  async getRandomCountryCity(): Promise<RandomCountryCityDto[]> {
    return this.uploadService.getRandomCountry();
  }
}
