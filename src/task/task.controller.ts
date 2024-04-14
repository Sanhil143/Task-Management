import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { TaskEntity } from './schema/task.entity';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { UserGuard } from 'src/auth/guards/user.guard';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(AdminGuard)
  @Post('create')
  async create(@Body() createTaskDto: CreateTaskDto) {
    try {
      await this.taskService.create(createTaskDto);
      return {
        success: true,
        message: 'Task Created Successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @UseGuards(AdminGuard)
  @Get(':userId')
  async getAllTasks(@Param('userId') userId: number): Promise<TaskEntity[]> {
    return this.taskService.getAllTasks(userId);
  }

  @UseGuards(UserGuard)
  @Get('/assignee/:assigneeId')
  async getTasksByAssignee(
    @Param('assigneeId') assigneeId: number,
  ): Promise<TaskEntity[] | { status: boolean; error: string }>{
    if(!assigneeId){
      return ({status:false, error:"userId is required"})
    }
    return this.taskService.getTasksByAssignee(assigneeId);
  }

  @UseGuards(UserGuard)
  @Get('/completed/:assigneeId')
  async getCompletedTask(
    @Param('assigneeId') assigneeId: number,
  ): Promise<TaskEntity[] | { status: boolean; error: string }> {
    if(!assigneeId){
      return ({status:false, error:"userId is required"})
    }
    return this.taskService.getCompletedTask(assigneeId);
  }

  @UseGuards(UserGuard)
  @Get('/pending/:assigneeId')
  async getPendingTask(
    @Param('assigneeId') assigneeId: number,
  ): Promise<TaskEntity[] | { status: boolean; error: string }> {
    if(!assigneeId){
      return ({status:false, error:"userId is required"})
    }
    return this.taskService.getPendingTask(assigneeId);
  }

  @UseGuards(AdminGuard)
  @Patch(':taskId/:userId/updateStatus')
  async updateTaskStatus(
    @Param('taskId') taskId: number,
    @Param('userId') userId: number,
  ): Promise<TaskEntity> {
    return this.taskService.updateTaskStatus(taskId,userId);
  }

  @UseGuards(AdminGuard)
  @Patch(':taskId/:userId/updateDate')
  async updateTaskDate(
    @Param('taskId') taskId: number,
    @Param('userId') userId: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskEntity> {
    return this.taskService.updateTaskDate(taskId, userId,updateTaskDto);
  }
}
