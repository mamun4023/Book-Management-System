import { Test, TestingModule } from '@nestjs/testing';
import { AuthorService } from './author.service';
import { getModelToken } from '@nestjs/mongoose';
import { Author } from './author.schema';

describe('AuthorService', () => {
  let service: AuthorService;

  beforeEach(async () => {
    const mockAuthorModel = {
      create: jest.fn(),
      find: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorService,
        {
          provide: getModelToken(Author.name),
          useValue: mockAuthorModel,
        },
      ],
    }).compile();

    service = module.get<AuthorService>(AuthorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
