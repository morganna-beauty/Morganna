import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class User {
  @ApiProperty({ description: 'Unique identifier for the user' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Unique username' })
  @Column({ unique: true })
  username: string;

  @ApiProperty({ description: 'Unique email address' })
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ApiProperty({ description: 'User role', enum: UserRole })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @ApiProperty({ description: 'Whether the user is active' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Date when the user was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Date when the user was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}
