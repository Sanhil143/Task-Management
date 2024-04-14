import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('login')
  async login(
    @Body() credentials: { email: string; password: string },
  ): Promise<any> {
    if(!credentials.email){
      return {status:false, error:'email is required'}
    }
    if(!credentials.password){
        return {status:false, error:'password is required or provide minimum 6 character'}
      }
    const user = await this.userService.findByEmail(credentials.email);
    if (!user) {
      throw new UnauthorizedException(`invalid email ${credentials.email}`);
    }
    const passwordMatch = await bcrypt.compare(
      credentials.password,
      user.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException(`invalid password ${credentials.password}`);
    }
    const token = this.authService.getTokens(user.id, user.role);

    return {
      status: true,
      message: 'login successfully',
      token: token.accessToken,
      userId: user.id,
      userType:user.role,
      firstName:user.firstName
    };
  }

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
      const token = this.authService.getTokens(savedUser.id, savedUser.role);
      return {
        success: true,
        message: 'User Created Successfully',
        data:savedUser,
        token:token.accessToken
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
