import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

type JwtPayload = {
  userId: number;
  role: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.Jwt_Secret,
    });
  }

  validate(payload: JwtPayload) {
    if (!payload.role) {
      throw new UnauthorizedException('Invalid token: Role not found');
    }
    return payload;
  }
}
