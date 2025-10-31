import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersFirestoreService } from '../users/users-firestore.service';
import { UserRole } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(private usersService: UsersFirestoreService) {}

  async onModuleInit() {
    await this.createDefaultAdmin();
  }

  private async createDefaultAdmin() {
    try {
      const existingAdmin = await this.usersService.findByUsername('admin');

      if (!existingAdmin) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash('admin123', saltRounds);

        await this.usersService.create({
          username: 'admin',
          email: 'admin@morganna.com',
          password: hashedPassword,
          role: UserRole.ADMIN,
        });
      }
    } catch (error) {
      // Silently handle error
    }
  }
}
