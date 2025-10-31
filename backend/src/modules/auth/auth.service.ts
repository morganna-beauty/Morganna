import { Injectable } from '@nestjs/common';
import { UsersFirestoreService } from '../users/users-firestore.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersFirestoreService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;

      return result;
    }

    return null;
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.username, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  async register(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    // Verificar si el usuario ya existe
    const existingUser = await this.usersService.findByUsername(
      createUserDto.username,
    );

    if (existingUser) {
      throw new ConflictException('El nombre de usuario ya existe');
    }

    // Verificar si el email ya existe
    const existingEmail = await this.usersService.findByEmail(
      createUserDto.email,
    );

    if (existingEmail) {
      throw new ConflictException('El email ya está registrado');
    }

    // Encriptar la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    // Crear el usuario
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // Generar token JWT
    const payload = {
      username: newUser.username,
      sub: newUser.id,
      role: newUser.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    };
  }
}
