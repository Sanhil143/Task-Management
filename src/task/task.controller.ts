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
import { CreateTaskDto } from './dto/task.dto';
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
  @Get()
  async getAllTasks(): Promise<TaskEntity[]> {
    return this.taskService.getAllTasks();
  }

  @UseGuards(UserGuard)
  @Get('/assignee/:assigneeId')
  async getTasksByAssignee(
    @Param('assigneeId') assigneeId: number,
  ): Promise<TaskEntity[]> {
    return this.taskService.getTasksByAssignee(assigneeId);
  }

  @UseGuards(AdminGuard)
  @Patch(':id/updateStatus')
  async updateTaskStatus(@Param('id') taskId: number): Promise<TaskEntity> {
    return this.taskService.updateTaskStatus(taskId);
  }

  @UseGuards(AdminGuard)
  @Patch(':id/updateDate')
  async updateTaskDate(
    @Param('id') taskId: number,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<TaskEntity> {
    return this.taskService.updateTaskDate(taskId, createTaskDto);
  }
}
