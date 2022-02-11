import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { CreateTaskDto } from './DTOs/create-task.dto';
import { GetTasksFilterDto } from './DTOs/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './DTOs/update-task-status.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');

  constructor(private tasksService: TasksService) {}

  @Get()
  async getTasks(@GetUser() user: User, @Query() filterDto: GetTasksFilterDto) {
    this.logger.verbose(`User ${user.username} retrieving his tasks`);
    this.logger.debug(filterDto);
    return this.tasksService.getTasks(filterDto, user);
  }

  @Get('/:id')
  async getTaskById(@GetUser() user: User, @Param('id') id: string) {
    return await this.tasksService.getTask(id, user);
  }

  @Post()
  async createTask(@GetUser() user: User, @Body() task: CreateTaskDto) {
    return await this.tasksService.createTask(task, user);
  }

  @Patch('/:id/status')
  async updateTask(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() { status }: UpdateTaskStatusDto,
  ) {
    return await this.tasksService.updateTask(id, status, user);
  }

  @Delete('/:id')
  async deleteTask(@GetUser() user: User, @Param('id') id: string) {
    return await this.tasksService.deleteTask(id, user);
  }
}
