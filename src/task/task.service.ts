import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './schema/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/task.dto';
import { UserEntity } from '../user/schema/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    const { description, due_date, asignee } = createTaskDto;

    const user = await this.userRepository.findOne({ where: { id: asignee } });
    if (!user) {
      throw new Error('User not found');
    }
    const newTask = new TaskEntity();
    newTask.description = description;
    newTask.due_date = due_date;
    newTask.asignee = user;
    newTask.status = 'pending';

    return this.taskRepository.save(newTask);
  }

  async getAllTasks(): Promise<TaskEntity[]> {
    return await this.taskRepository.find();
  }

  async getTasksByAssignee(asigneeId: number): Promise<TaskEntity[]> {
    return await this.taskRepository.find({
      where: { asignee: { id: asigneeId } },
    });
  }

  async updateTaskStatus(taskId: number): Promise<TaskEntity> {
    const task = await this.taskRepository.findOne({
      where: { taskId: taskId },
    });
    if (!task) {
      throw new Error('Task not found');
    }
    task.status = 'completed';
    return await this.taskRepository.save(task);
  }

  async updateTaskDate(
    taskId: number,
    createTaskDto: CreateTaskDto,
  ): Promise<TaskEntity> {
    const { due_date } = createTaskDto;
    const task = await this.taskRepository.findOne({
      where: { taskId: taskId },
    });
    if (!task) {
      throw new Error('Task not found');
    }
    task.due_date = due_date;
    return await this.taskRepository.save(task);
  }
}
