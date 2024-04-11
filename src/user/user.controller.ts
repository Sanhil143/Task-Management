import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { UserGuard } from 'src/auth/guards/user.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      let { role, password } = createUserDto;
      if (!role) {
        role = 'user';
      }
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltOrRounds);
      createUserDto.role;
      createUserDto.password = hashedPassword;
      await this.userService.create(createUserDto);
      return {
        success: true,
        message: 'User Created Successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @UseGuards(UserGuard)
  @Get('profile/:userId')
  async profile(@Param('userId') userId: number) {
    try {
      const user = await this.userService.findById(userId);
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
