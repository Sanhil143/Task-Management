import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamEntity } from './schema/team.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeamEntity]),
    JwtModule.register({ secret: process.env.Jwt_Secret }),
  ],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
