import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
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
      let { firstName,lastName,role, email,password } = createUserDto;
      if(!firstName){
        return {status:false, error:'firstname is required'}
      }
      createUserDto.firstName = firstName.trim().toLowerCase()
      if(!lastName){
        return {status:false, error:'lastname is required'}
      }
      createUserDto.lastName = lastName.trim().toLowerCase()
      if(!email){
        return {status:false, error:'email is required'}
      }
      if (!role) {
        role = 'user';
      }
      if(!password || password.length <  6){
          return {status:false, error:'password is required or provide minimum 6 character'}
        }
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltOrRounds);
      createUserDto.role;
      createUserDto.password = hashedPassword;
      const savedUser = await this.userService.create(createUserDto);
      return {
        success: true,
        message: 'User Created Successfully',
        data:savedUser
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
      if(!userId){
        return {status:false, error:'missing userid'}
      }
      const user = await this.userService.findById(userId);
      if(user){
        delete user.password
      }
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
