import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Username or email for login',
    example: 'admin@morganna.com',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'User password',
    example: 'Admin123!',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
