import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { AuthorService } from '../author/author.service';
import { getModelToken } from '@nestjs/mongoose';
import { Book } from './book.schema';

describe('BookService', () => {
  let service: BookService;

  const mockBookModel = {
    create: jest.fn(),
    find: jest.fn(),
  };

  const mockAuthorService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        AuthorService,
        {
          provide: getModelToken(Book.name),
          useValue: mockBookModel,
        },
        {
          provide: AuthorService,
          useValue: mockAuthorService,
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
