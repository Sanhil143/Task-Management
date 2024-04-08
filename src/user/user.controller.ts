import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto} from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService:UserService
  ) {}

  @Post('create')
  async create(@Body() createUserDto : CreateUserDto){
    try {
      await this.userService.create(createUserDto);
      return {
        success: true,
        message: 'User Created Successfully',
      };
    } catch (error) {
      return{
        success:false,
        message:error.message
      }
    }
  }
}
