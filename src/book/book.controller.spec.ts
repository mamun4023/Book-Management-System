import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { getModelToken } from '@nestjs/mongoose';
import { Book } from './book.schema';
import { AuthorService } from '../author/author.service';
import { Author } from '../author/author.schema';

describe('BookController', () => {
  let controller: BookController;
  let mockBookService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    const mockBookModel = {
      create: jest.fn(),
      find: jest.fn(),
    };
    const mockAuthorModel = {
      findOne: jest.fn(),
    };
    mockBookService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        { provide: BookService, useValue: mockBookService },
        AuthorService,
        {
          provide: getModelToken(Book.name),
          useValue: mockBookModel,
        },
        {
          provide: getModelToken(Author.name),
          useValue: mockAuthorModel,
        },
      ],
    }).compile();

    controller = module.get<BookController>(BookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should throw BAD_REQUEST for invalid authorId', async () => {
      await expect(
        controller.create({
          title: 'T',
          isbn: 'ISBN',
          genre: 'G',
          authorId: 'invalid-id' as any,
        } as any),
      ).rejects.toMatchObject({ status: 400, message: 'Invalid author ID' });
    });

    it('should throw BAD_REQUEST if service returns null', async () => {
      mockBookService.create.mockResolvedValueOnce(null);
      await expect(
        controller.create({
          title: 'T',
          isbn: 'ISBN',
          genre: 'G',
          authorId: '507f1f77bcf86cd799439011',
        } as any),
      ).rejects.toMatchObject({ status: 400, message: 'Book not created' });
    });

    it('should return success response on create', async () => {
      const created = { _id: '1', title: 'T' } as any;
      mockBookService.create.mockResolvedValueOnce(created);
      const res = await controller.create({
        title: 'T',
        isbn: 'ISBN',
        genre: 'G',
        authorId: '507f1f77bcf86cd799439011',
      } as any);
      expect(res).toEqual({
        success: true,
        message: 'Book created successfully',
        data: created,
      });
    });
  });

  describe('findAll', () => {
    it('should delegate to service and return its result', async () => {
      const result = { success: true } as any;
      mockBookService.findAll.mockResolvedValueOnce(result);
      const res = await controller.findAll(1 as any, 10 as any, 'F' as any, '507f1f77bcf86cd799439011' as any, 'q' as any);
      expect(res).toBe(result);
      expect(mockBookService.findAll).toHaveBeenCalledWith({ page: 1, limit: 10, genre: 'F', authorId: '507f1f77bcf86cd799439011', search: 'q' });
    });
  });

  describe('findOne', () => {
    it('should throw BAD_REQUEST for invalid id', async () => {
      await expect(controller.findOne('invalid-id')).rejects.toMatchObject({ status: 400, message: 'Invalid ID' });
    });

    it('should throw NOT_FOUND if service returns null', async () => {
      mockBookService.findOne.mockResolvedValueOnce(null);
      await expect(controller.findOne('507f1f77bcf86cd799439011')).rejects.toMatchObject({ status: 404, message: 'Book not found' });
    });

    it('should return success response on findOne', async () => {
      const found = { _id: '1' } as any;
      mockBookService.findOne.mockResolvedValueOnce(found);
      const res = await controller.findOne('507f1f77bcf86cd799439011');
      expect(res).toEqual({ success: true, message: 'Book found successfully', data: found });
    });
  });

  describe('update', () => {
    it('should throw BAD_REQUEST for invalid id', async () => {
      await expect(controller.update('invalid-id', {} as any)).rejects.toMatchObject({ status: 400, message: 'Invalid ID' });
    });

    it('should throw NOT_FOUND if service returns null', async () => {
      mockBookService.update.mockResolvedValueOnce(null);
      await expect(controller.update('507f1f77bcf86cd799439011', {} as any)).rejects.toMatchObject({ status: 404, message: 'Book not found' });
    });

    it('should return success response on update', async () => {
      const updated = { _id: '1', title: 'New' } as any;
      mockBookService.update.mockResolvedValueOnce(updated);
      const res = await controller.update('507f1f77bcf86cd799439011', { title: 'New' } as any);
      expect(res).toEqual({ success: true, message: 'Book updated successfully', data: updated });
    });
  });

  describe('remove', () => {
    it('should throw BAD_REQUEST for invalid id', async () => {
      await expect(controller.remove('invalid-id')).rejects.toMatchObject({ status: 400, message: 'Invalid ID' });
    });

    it('should throw NOT_FOUND if book not exists before delete', async () => {
      mockBookService.findOne.mockResolvedValueOnce(null);
      await expect(controller.remove('507f1f77bcf86cd799439011')).rejects.toMatchObject({ status: 404, message: 'Book not found' });
    });

    it('should return success response on remove', async () => {
      mockBookService.findOne.mockResolvedValueOnce({ _id: '1' } as any);
      const deleted = { acknowledged: true } as any;
      mockBookService.remove.mockResolvedValueOnce(deleted);
      const res = await controller.remove('507f1f77bcf86cd799439011');
      expect(res).toEqual({ success: true, message: 'Book deleted successfully', data: deleted });
    });
  });
});
