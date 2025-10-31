import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../../common/firebase/firebase.service';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FirestoreUser } from './interfaces/firestore-user.interface';

@Injectable()
export class UsersFirestoreService {
  private readonly collectionName = 'users';

  constructor(private readonly firebaseService: FirebaseService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const firestoreUser: Omit<FirestoreUser, 'id'> = {
      username: createUserDto.username,
      email: createUserDto.email,
      password: createUserDto.password,
      role: createUserDto.role || UserRole.USER,
      isActive: createUserDto.isActive !== false,
    };

    const createdUser = await this.firebaseService.create<FirestoreUser>(
      this.collectionName,
      firestoreUser,
    );

    return this.mapFirestoreUserToEntity(createdUser);
  }

  async findAll(): Promise<User[]> {
    const firestoreUsers =
      await this.firebaseService.getCollection<FirestoreUser>(
        this.collectionName,
      );

    return firestoreUsers.map((user) =>
      this.mapFirestoreUserToEntity(user, true),
    );
  }

  async findOne(id: string): Promise<User> {
    const firestoreUser = await this.firebaseService.getDocument<FirestoreUser>(
      this.collectionName,
      id,
    );

    if (!firestoreUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.mapFirestoreUserToEntity(firestoreUser, true);
  }

  async findByUsername(username: string): Promise<User | null> {
    const firestoreUser =
      await this.firebaseService.findOneByField<FirestoreUser>(
        this.collectionName,
        'username',
        username,
      );

    if (!firestoreUser) {
      return null;
    }

    return this.mapFirestoreUserToEntity(firestoreUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const firestoreUser =
      await this.firebaseService.findOneByField<FirestoreUser>(
        this.collectionName,
        'email',
        email,
      );

    if (!firestoreUser) {
      return null;
    }

    return this.mapFirestoreUserToEntity(firestoreUser);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.firebaseService.getDocument<FirestoreUser>(
      this.collectionName,
      id,
    );

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updateData: Partial<FirestoreUser> = {};

    if (updateUserDto.username !== undefined) {
      updateData.username = updateUserDto.username;
    }

    if (updateUserDto.email !== undefined) {
      updateData.email = updateUserDto.email;
    }

    if (updateUserDto.password !== undefined) {
      updateData.password = updateUserDto.password;
    }

    if (updateUserDto.role !== undefined) {
      updateData.role = updateUserDto.role;
    }

    if (updateUserDto.isActive !== undefined) {
      updateData.isActive = updateUserDto.isActive;
    }

    const updatedUser =
      await this.firebaseService.updateDocument<FirestoreUser>(
        this.collectionName,
        id,
        updateData,
      );

    return this.mapFirestoreUserToEntity(updatedUser, true);
  }

  async remove(id: string): Promise<void> {
    const existingUser = await this.firebaseService.getDocument<FirestoreUser>(
      this.collectionName,
      id,
    );

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.firebaseService.deleteDocument(this.collectionName, id);
  }

  private mapFirestoreUserToEntity(
    firestoreUser: FirestoreUser,
    excludePassword = false,
  ): User {
    const user = new User();

    user.id = parseInt(firestoreUser.id || '0', 10);
    user.username = firestoreUser.username;
    user.email = firestoreUser.email;
    user.role = firestoreUser.role as UserRole;
    user.isActive = firestoreUser.isActive;

    if (!excludePassword) {
      user.password = firestoreUser.password;
    }

    if (firestoreUser.createdAt) {
      user.createdAt = this.convertFirestoreTimestamp(firestoreUser.createdAt);
    }

    if (firestoreUser.updatedAt) {
      user.updatedAt = this.convertFirestoreTimestamp(firestoreUser.updatedAt);
    }

    return user;
  }

  private convertFirestoreTimestamp(
    timestamp: FirebaseFirestore.Timestamp | Date,
  ): Date {
    if (timestamp instanceof Date) {
      return timestamp;
    }

    if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
      return (timestamp as any).toDate();
    }

    return new Date();
  }
}
