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
    const user = await this.userService.findByEmail(credentials.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const passwordMatch = await bcrypt.compare(
      credentials.password,
      user.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
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
