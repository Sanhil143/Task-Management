import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/schema/user.entity';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { TaskEntity } from './task/schema/task.entity';
import { TeamModule } from './team/team.module';
import { TeamEntity } from './team/schema/team.entity';
import { TeamMemberShipModule } from './team-member/team-member.module';
import { TeamMemberShipEntity } from './team-member/schema/team-member.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_Type as any,
      host: process.env.Host,
      port: parseInt(process.env.DB_Port),
      username: process.env.DB_User,
      password: process.env.DB_Pass,
      database: process.env.DB_Name,
      entities: [UserEntity, TaskEntity, TeamEntity, TeamMemberShipEntity],
      synchronize: true,
      options: {
        encrypt: true,
        trustServerCertificate: true,
      },
    }),
    UserModule,
    AuthModule,
    TaskModule,
    TeamModule,
    TeamMemberShipModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
