import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

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
    };
  }
}
