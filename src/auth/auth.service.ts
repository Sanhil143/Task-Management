import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  getTokens(userId: number, role: string) {
    const payload = { userId: userId, role: role };
    const accessToken = this.jwtService.sign(payload, {
      secret: 'Sanhil',
      // expiresIn: '15m',
    });

    return {
      accessToken,
    };
  }
}
