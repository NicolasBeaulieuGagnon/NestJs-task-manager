import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});
const mockUser = {
  username: 'mock',
  id: 'someId',
  password: 'mockPassword',
  tasks: [],
};

const mockTask = {
  title: 'Mock title',
  description: 'Mock description',
  id: '123',
  status: TaskStatus.DONE,
};

describe('Task Service', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    //init NestJS module with service and repository
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TasksRepository,
          useFactory: mockTaskRepository,
        },
      ],
    }).compile();
    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue('someValue');
      const result = await tasksService.getTasks(null, mockUser);
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('calls TaskRepository.findOne and returns the result', async () => {
      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('123', mockUser);
      expect(result).toEqual(mockTask);
    });
    it('calls TaskRepository.findOne and returns an Error', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById('someId', mockUser)).rejects.toThrow(
        `No task found at id "someId" .`,
      );
      //   const result = await tasksService.getTaskById('123')
    });
  });
});
