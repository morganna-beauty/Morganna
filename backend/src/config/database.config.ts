import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Product } from '../modules/products/entities/product.entity';

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'morganna_db',
  entities: [Product],
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
});
