import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/task.dto';
import { TaskEntity } from './schema/task.entity';

@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService:TaskService
  ) {}

  @Post('create')
  async create(@Body() createTaskDto : CreateTaskDto){
    try {
      await this.taskService.create(createTaskDto);
      return {
        success: true,
        message: 'Task Created Successfully',
      };
    } catch (error) {
      return{
        success:false,
        message:error.message
      }
    }
  }

  @Get()
  async getAllTasks(): Promise<TaskEntity[]> {
    return this.taskService.getAllTasks();
  }

  @Get('/assignee/:assigneeId')
  async getTasksByAssignee(@Param('assigneeId') assigneeId: number): Promise<TaskEntity[]> {
    return this.taskService.getTasksByAssignee(assigneeId);
  }

  @Patch(':id/updateStatus')
  async updateTaskStatus(@Param('id') taskId: number): Promise<TaskEntity> {
    return this.taskService.updateTaskStatus(taskId);
  }
}
