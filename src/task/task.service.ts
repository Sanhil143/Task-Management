import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './schema/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
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
    const { description, due_date, asignee, userId } = createTaskDto;

    const user = await this.userRepository.findOne({ where: { id: asignee } });
    if (!user) {
      throw new Error('User not found');
    }
    const newTask = new TaskEntity();
    newTask.description = description;
    newTask.due_date = due_date;
    newTask.asignee = user;
    newTask.status = 'pending';
    newTask.userId = userId;

    return this.taskRepository.save(newTask);
  }

  async getAllTasks(userId: number) {
    const allTasks = await this.taskRepository.find({
        where: { userId: userId, isDeleted: false },
        order: { createdAt: 'DESC' },
        relations: ['asignee'],
    });

    if (allTasks.length > 0) {
        const tasks = allTasks.map(task => ({
            taskId: task.taskId,
            description: task.description,
            adminId: task.userId,
            status:task.status,
            dueDate: task.due_date,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
            asigneeId: task.asignee.id,
            firstName: task.asignee.firstName,
            lastName: task.asignee.lastName
        }));
        return tasks;
    } else {
        throw new Error('Tasks not found');
    }
}

  async getCompletedTaskByAdmin(userId: number) {
  const allTasks =  await this.taskRepository.find({
    where: { userId: userId, status: 'completed' },
    order: { createdAt: 'DESC' },
    relations:['asignee']
  });
  if (allTasks.length > 0) {
    const tasks = allTasks.map(task => ({
        taskId: task.taskId,
        description: task.description,
        adminId: task.userId,
        status:task.status,
        dueDate: task.due_date,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        asigneeId: task.asignee.id,
        firstName: task.asignee.firstName,
        lastName: task.asignee.lastName
    }));
    return tasks;
  } else {
    throw new Error('Tasks not found');
  }
}

async getPendingTaskByAdmin(userId: number){
  const allTasks =  await this.taskRepository.find({
    where: { userId: userId, status: 'pending' },
    order: { createdAt: 'DESC' },
    relations:['asignee']
  });
  if (allTasks.length > 0) {
    const tasks = allTasks.map(task => ({
        taskId: task.taskId,
        description: task.description,
        adminId: task.userId,
        status:task.status,
        dueDate: task.due_date,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        asigneeId: task.asignee.id,
        firstName: task.asignee.firstName,
        lastName: task.asignee.lastName
    }));
    return tasks;
  } else {
    throw new Error('Tasks not found');
  }
}

  async getTasksByAssignee(asigneeId: number): Promise<TaskEntity[]> {
    return await this.taskRepository.find({
      where: { asignee: { id: asigneeId } },
      order: { createdAt: 'DESC' },
    });
  }

  async getCompletedTask(asigneeId: number): Promise<TaskEntity[]> {
    return await this.taskRepository.find({
      where: { asignee: { id: asigneeId }, status: 'completed' },
      order: { createdAt: 'DESC' },
    });
  }

  async getPendingTask(asigneeId: number): Promise<TaskEntity[]> {
    return await this.taskRepository.find({
      where: { asignee: { id: asigneeId }, status: 'pending' },
      order: { createdAt: 'DESC' },
    });
  }

  async updateTaskStatus(taskId: number, userId: number): Promise<TaskEntity> {
    const task = await this.taskRepository.findOne({
      where: { taskId:taskId,userId:userId },
    });
    if (!task) {
      throw new Error('Task not found');
    }
    task.status = 'completed';
    task.updatedAt = new Date();
    return await this.taskRepository.save(task);
  }

  async updateTaskDate(
    taskId: number,
    userId: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskEntity> {
    const { due_date } = updateTaskDto;
    const task = await this.taskRepository.findOne({
      where: { taskId: taskId, userId: userId },
    });
    if (!task) {
      throw new Error('Task not found');
    }
    task.due_date = due_date;
    task.updatedAt = new Date();
    return await this.taskRepository.save(task);
  }
}
