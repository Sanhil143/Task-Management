import { Injectable,HttpException } from '@nestjs/common';
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

  async create(
    createUserDto: CreateUserDto,
  ) : Promise<UserEntity> {
    const userData = await this.userRepository.save(createUserDto);
    return this.userRepository.save(userData);  
  }
}
