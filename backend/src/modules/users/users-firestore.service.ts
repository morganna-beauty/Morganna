import { Injectable } from '@nestjs/common';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FirestoreUser } from './interfaces/firestore-user.interface';
import { BaseFirestoreService } from '../../common/firebase/base-firestore.service';
import { FirebaseService } from '../../common/firebase/firebase.service';
import { TransformUtils } from '../../common/utils/validation.utils';

@Injectable()
export class UsersFirestoreService extends BaseFirestoreService<
  User,
  FirestoreUser,
  CreateUserDto,
  UpdateUserDto
> {
  protected readonly collectionName = 'users';

  protected readonly searchFields = {
    text: ['username', 'email'],
  };

  constructor(firebaseService: FirebaseService) {
    super(firebaseService);
  }

  protected mapCreateDtoToFirestore(
    createDto: CreateUserDto,
  ): Omit<FirestoreUser, 'id'> {
    return {
      username: createDto.username,
      email: createDto.email,
      password: createDto.password,
      role: createDto.role || UserRole.USER,
      isActive: createDto.isActive !== false,
    };
  }

  protected mapUpdateDtoToFirestore(
    updateDto: UpdateUserDto,
  ): Partial<FirestoreUser> {
    return TransformUtils.removeUndefined({
      username: updateDto.username,
      email: updateDto.email,
      password: updateDto.password,
      role: updateDto.role,
      isActive: updateDto.isActive,
    });
  }

  protected mapFirestoreToEntity(
    document: FirestoreUser,
    excludePassword = false,
  ): User {
    const user = new User();

    user.id = TransformUtils.safeParseInt(document.id);
    user.username = document.username;
    user.email = document.email;
    user.role = document.role as UserRole;
    user.isActive = document.isActive;

    if (!excludePassword) {
      user.password = document.password;
    }

    user.createdAt = this.convertFirestoreTimestamp(document.createdAt);
    user.updatedAt = this.convertFirestoreTimestamp(document.updatedAt);

    return user;
  }

  protected getEntityName(): string {
    return 'User';
  }

  async findAll(): Promise<User[]> {
    const documents = await this.firebaseService.getCollection<FirestoreUser>(
      this.collectionName,
    );

    return documents.map((document) =>
      this.mapFirestoreToEntity(document, true),
    );
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.findOneByField('username', username);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.findOneByField('email', email);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await super.update(id, updateUserDto);

    // Remove password from response for security
    delete updatedUser.password;

    return updatedUser;
  }
}
