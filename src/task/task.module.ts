import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './schema/task.entity';
import { UserEntity } from 'src/user/schema/user.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([TaskEntity,UserEntity])
  ],
  controllers: [TaskController],
  providers: [TaskService]
})
export class TaskModule {}
