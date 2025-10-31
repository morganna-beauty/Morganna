import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './modules/products/products.module';
import { CommonModule } from './common/common.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { SeedModule } from './modules/seed/seed.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ProductsModule,
    CommonModule,
    UsersModule,
    AuthModule,
    SeedModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
