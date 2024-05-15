import {
  Injectable,
  ConflictException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './schema/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const userData = await this.userRepository.save(createUserDto);

    // if (savedUser) { 
    //   delete savedUser.password;
    // }

    return userData;
  }

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async generateToken(user: UserEntity): Promise<object> {
    const payload = { role: user.role, id: user.id };
    return payload;
  }

  async findById(id: number): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({ where: { id: id } });
  }

  async updateProfile(userId: number, updateUserDto: UpdateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!existingUser) {
      if (existingUser) {
        throw new Error('user not found');
      }
    }
    if (updateUserDto.firstName !== undefined) {
      existingUser.firstName = updateUserDto.firstName.toLowerCase();
    }
    if (updateUserDto.email !== undefined) {
      existingUser.email = updateUserDto.email;
    }
    if (updateUserDto.lastName !== undefined) {
      existingUser.lastName = updateUserDto.lastName.toLowerCase();
    }
    existingUser.updatedAt = new Date();
    const updatedData = await this.userRepository.save(existingUser);
    return updatedData;
  }
}
