import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserGuard } from 'src/auth/guards/user.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

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
