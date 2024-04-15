import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserGuard } from 'src/auth/guards/user.guard';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/user.dto';

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
      if (!userId) {
        return { status: false, error: 'missing userid' };
      }
      const user = await this.userService.findById(userId);
      if (user) {
        delete user.password;
      }
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(UserGuard)
  @Patch('profile/:userId')
  async updateProfile(
    @Param('userId') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      if (!userId) {
        return { status: false, statusCode: 400, error: 'userId is required' };
      }

      if (Object.keys(updateUserDto).length === 0) {
        return {
          status: false,
          statusCode: 400,
          error: 'please provide some data for updation',
        };
      }
      const updatedData = await this.userService.updateProfile(
        userId,
        updateUserDto,
      );
      if (!updatedData) {
        return {
          status: false,
          statusCode: 400,
          message: 'error during user updation',
        };
      }
      return {
        success: true,
        statusCode: 200,
        message: 'user updated successfully',
        data:updatedData
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
