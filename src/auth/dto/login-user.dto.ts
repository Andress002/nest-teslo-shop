import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @IsString()
  email!: string;

  @IsString()
  @MinLength(6, {
    message: 'The password must be at least 6 characters long',
  })
  @MaxLength(50, {
    message: 'The password must not exceed 50 characters',
  })
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password!: string;
}
