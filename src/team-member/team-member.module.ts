import { Module } from '@nestjs/common';
import { TeamMemberShipService } from './team-member.service';
import { TeamMemberShipController } from './team-member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamMemberShipEntity } from './schema/team-member.entity';
import { UserEntity } from 'src/user/schema/user.entity';
import { TeamEntity } from 'src/team/schema/team.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeamMemberShipEntity, UserEntity, TeamEntity]),
    JwtModule.register({ secret: process.env.Jwt_Secret }),
  ],
  controllers: [TeamMemberShipController],
  providers: [TeamMemberShipService],
})
export class TeamMemberShipModule {}
