import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(private usersService: UsersService) {}

  async onModuleInit() {
    await this.createDefaultAdmin();
  }

  private async createDefaultAdmin() {
    try {
      // Verificar si ya existe un usuario admin
      const existingAdmin = await this.usersService.findByUsername('admin');

      if (!existingAdmin) {
        // Crear usuario admin por defecto
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash('admin123', saltRounds);

        await this.usersService.create({
          username: 'admin',
          email: 'admin@morganna.com',
          password: hashedPassword,
          role: UserRole.ADMIN,
        });

        console.log('✅ Default admin user created: admin/admin123');
      }
    } catch (error) {
      console.warn('⚠️  Could not create default admin user:', error.message);
    }
  }
}
