import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.USER;
}
