import { Test, TestingModule } from '@nestjs/testing';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { getModelToken } from '@nestjs/mongoose';
import { Author } from './author.schema';

describe('AuthorController', () => {
  let controller: AuthorController;

  beforeEach(async () => {
    const mockAuthorModel = {
      create: jest.fn(),
      find: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorController],
      providers: [
        AuthorService,
        {
          provide: getModelToken(Author.name),
          useValue: mockAuthorModel,
        },
      ],
    }).compile();

    controller = module.get<AuthorController>(AuthorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
