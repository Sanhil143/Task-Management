import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './schema/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';

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
    const savedUser = await this.userRepository.save(userData);

    // if (savedUser) {
    //   delete savedUser.password;
    // }

    return savedUser;
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

}
