// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

// @Injectable()
// export class AdminGuard implements CanActivate {
//   canActivate(context: ExecutionContext): boolean {
//     const { user } = context.switchToHttp().getRequest();
//     if (!user || !user.role) {
//       return false;
//     }

//     return user.role === 'admin';
//   }
// }

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeaders(request.headers);

    if (!token) {
      return false; // Token not provided
    }

    try {
      const decoded = this.jwtService.verify(token);
      if (decoded && decoded.role === 'admin') {
        request.user = decoded;
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  private extractTokenFromHeaders(headers: any): string | null {
    if (headers && headers.authorization) {
      const parts = headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        return parts[1];
      }
    }
    return null;
  }
}
