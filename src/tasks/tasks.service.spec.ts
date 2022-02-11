import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTasksRepo = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

const mockUser = {
  username: 'Andrew',
  id: "andrew's uuid",
  password: 'iambatman',
  tasks: [],
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepo },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue('mockedValue');
      const result = await tasksService.getTasks({}, mockUser);
      expect(result).toEqual('mockedValue');
    });
  });

  describe('getTaskById', () => {
    it('calls TasksRepository.findOne and returns the result', async () => {
      const mockTask = {
        title: 'Title',
        description: 'Description',
        id: 'fakeuuid',
        status: TaskStatus.OPEN,
      };

      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTask('fakeuuid', mockUser);
      expect(result).toEqual(mockTask);
    });

    it('calls TasksRepository.findOne and handles an error', async () => {
      tasksRepository.findOne.mockResolvedValue(undefined);
      expect(tasksService.getTask('fakeuuid', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
