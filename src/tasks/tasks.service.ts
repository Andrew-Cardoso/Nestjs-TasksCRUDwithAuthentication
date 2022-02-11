import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './DTOs/create-task.dto';
import { GetTasksFilterDto } from './DTOs/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  private logger = new Logger('TasksService', { timestamp: true });
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  async getTask(id: string, user: User) {
    const task = await this.tasksRepository.findOne({ id, user });
    console.log(task);
    if (task) return task;
    throw new NotFoundException(`Nenhuma task com o id ${id} foi encontrada`);
  }

  async getTasks(filter: GetTasksFilterDto, user: User) {
    this.logger.verbose('ms - Fetching all tasks');
    const tasks = await this.tasksRepository.getTasks(filter, user);
    this.logger.verbose('ms - All tasks fetched');
    return tasks;
  }

  async createTask(taskDto: CreateTaskDto, user: User) {
    return await this.tasksRepository.createTask(taskDto, user);
  }

  async updateTask(id: string, status: TaskStatus, user: User) {
    const task = await this.getTask(id, user);
    task.status = status;
    await this.tasksRepository.save(task);
  }

  async deleteTask(id: string, user: User) {
    const { affected } = await this.tasksRepository.delete({ id, user });
    if (!affected)
      throw new NotFoundException(`Nenhuma task com o id ${id} foi encontrada`);
  }
}
