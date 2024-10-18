import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

export function UploadJsonFile() {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, callback) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
          },
        }),
        fileFilter: (req, file, callback) => {
          if (file.mimetype !== 'application/json') {
            return callback(
              new Error('Invalid file type. Only JSON files are allowed.'),
              false,
            );
          }
          callback(null, true);
        },
      }),
    ),
  );
}
