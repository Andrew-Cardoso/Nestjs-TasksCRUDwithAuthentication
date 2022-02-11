import { NotFoundException } from '@nestjs/common';
import { User } from '../auth/user.entity';
import { hasValue } from '../utils/has-value';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './DTOs/create-task.dto';
import { GetTasksFilterDto } from './DTOs/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async getTasks({ status, search }: GetTasksFilterDto, user: User) {

    const query = this.createQueryBuilder('task');
    query.where({ user });
    status && query.andWhere('(task.status = :status)', { status });
    hasValue.string(search) &&
      query.andWhere(
        '(task.title ILIKE :search OR task.description ILIKE :search)',
        { search: `%${search}%` },
      );
    return await query.getMany();
  }

  async createTask(taskDto: CreateTaskDto, user: User) {
    const task = this.create({
      user,
      ...taskDto,
      status: TaskStatus.OPEN,
    });
    await this.save(task);
    return task;
  }
}
