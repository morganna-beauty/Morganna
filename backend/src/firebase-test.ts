import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersFirestoreService } from './modules/users/users-firestore.service';
import { ProductsFirestoreService } from './modules/products/products-firestore.service';
import { UserRole } from './modules/users/entities/user.entity';
import { HairType, Concern } from './modules/products/enums/product.enums';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  console.log('🔥 Firebase Migration Test Script');

  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const usersService = app.get(UsersFirestoreService);
    const productsService = app.get(ProductsFirestoreService);

    console.log('✅ Firebase services initialized');

    console.log('📝 Creating test user...');
    const hashedPassword = await bcrypt.hash('testpass123', 10);

    const testUser = await usersService.create({
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword,
      role: UserRole.USER,
    });

    console.log('✅ Test user created:', {
      id: testUser.id,
      username: testUser.username,
    });

    console.log('📝 Creating test product...');
    const testProduct = await productsService.create({
      title: 'Shampoo Hidratante',
      description: 'Shampoo para cabello seco y dañado',
      price: 29.99,
      stock: 100,
      hairType: HairType.RIZADO,
      concern: Concern.CABELLO_SECO,
      brand: 'Morganna Beauty',
    });

    console.log('✅ Test product created:', {
      id: testProduct.id,
      title: testProduct.title,
    });

    console.log('🔍 Testing queries...');
    const allUsers = await usersService.findAll();

    console.log(`✅ Found ${allUsers.length} users`);

    const allProducts = await productsService.findAll();

    console.log(`✅ Found ${allProducts.length} products`);

    const foundUser = await usersService.findByUsername('testuser');

    console.log(
      '✅ User lookup successful:',
      foundUser ? 'Found' : 'Not found',
    );

    console.log('🎉 Firebase migration test completed successfully!');
  } catch (error) {
    console.error('❌ Firebase migration test failed:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
