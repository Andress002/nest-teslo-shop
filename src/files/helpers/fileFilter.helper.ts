import { BadRequestException } from '@nestjs/common';
import { FileFilterCallback } from 'multer';

export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
): void => {
  if (!file) return callback(new Error('File is empty'));

  const fileExt: string = file.mimetype.split('/')[1] ?? '';
  const validExt: string[] = ['jpg', 'jpeg', 'png', 'gif'];
  if (!validExt.includes(fileExt)) {
    return callback(new BadRequestException('Invalid file type'), false);
  }
  callback(null, true);
};
