import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsArray,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { UserRole } from '../enums/roles.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5, {
    message: 'The full name must be at least 5 characters long',
  })
  fullName!: string;

  @IsArray()
  @IsEnum(UserRole, { each: true })
  @IsOptional()
  rol?: UserRole[];
}
