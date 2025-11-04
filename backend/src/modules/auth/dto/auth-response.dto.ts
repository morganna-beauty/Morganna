import { ApiProperty } from '@nestjs/swagger';

export class UserInfoDto {
  @ApiProperty({
    description: 'User ID',
    example: 'abc123def456',
  })
  id: string;

  @ApiProperty({
    description: 'Username',
    example: 'admin@morganna.com',
  })
  username: string;

  @ApiProperty({
    description: 'User email',
    example: 'admin@morganna.com',
  })
  email: string;

  @ApiProperty({
    description: 'User role',
    example: 'admin',
  })
  role: string;

  @ApiProperty({
    description: 'First name',
    example: 'Admin',
    required: false,
  })
  firstName?: string;

  @ApiProperty({
    description: 'Last name',
    example: 'User',
    required: false,
  })
  lastName?: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwidXNlcm5hbWUiOiJhZG1pbkBtb3JnYW5uYS5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2OTg3NjgwMDAsImV4cCI6MTY5ODg1NDQwMH0.example',
  })
  access_token: string;

  @ApiProperty({
    description: 'User information',
    type: UserInfoDto,
  })
  user: UserInfoDto;
}
