import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { CreateUserDto} from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService:UserService
  ) {}

  @Post('signin')
  async create(@Body() createUserDto : CreateUserDto){
    try {
      let {role,password} = createUserDto
      if(role){
        role = 'admin';
      }
      role = 'user'
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
      return{
        success:false,
        message:error.message
      }
    }
  }

  @Post('login')
  async login(@Body() credentials: { email: string; password: string }): Promise<any> {
    const user = await this.userService.findByEmail(credentials.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const passwordMatch = await bcrypt.compare(credentials.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = await this.userService.generateToken(user);
    return user ;
  }

  @Get('profile/:userId')
  async profile(@Param('userId') userId: number){
    try {
      const user = await this.userService.findById(userId);
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
}
}
