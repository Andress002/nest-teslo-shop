/* export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
): void => {
  if (!file) return callback(new Error('File is empty'));

  const fileExt: string = file.mimetype.split('/')[1] ?? '';
  const validExt: string[] = ['jpg', 'jpeg', 'png', 'gif'];
  if (!validExt.includes(fileExt)) {
    return callback(new BadRequestException('Invalid file type') as any, false);
  }
  callback(null, true);
}; */

export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
): void => {
  if (!file) return callback(new Error('File is empty'), false);

  const fileExtension: string = file.mimetype.split('/')[1] ?? '';
  const validExtensions: string[] = ['jpg', 'jpeg', 'png', 'gif'];
  if (validExtensions.includes(fileExtension)) {
    return callback(null, true);
  }
  callback(null, false);
};
