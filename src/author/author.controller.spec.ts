import { Test, TestingModule } from '@nestjs/testing';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { getModelToken } from '@nestjs/mongoose';
import { Author } from './author.schema';

describe('AuthorController', () => {
  const mockAuthorId = "507f1f77bcf86cd799439011"
  let controller: AuthorController;

  let mockAuthorService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {

    const mockAuthorModel = {
      create: jest.fn(),
      find: jest.fn(),
    };
    mockAuthorService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorController],
      providers: [
        { provide: AuthorService, useValue: mockAuthorService },
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

  describe('create', () => {
    it('throws BAD_REQUEST when service returns null', async () => {
      mockAuthorService.create.mockResolvedValueOnce(null);
      await expect(controller.create({ firstName: 'A', lastName: 'B' } as any)).rejects.toMatchObject({ status: 400, message: 'Author not created' });
    });

    it('returns success response on create', async () => {
      const author = { _id: 'a1' } as any;
      mockAuthorService.create.mockResolvedValueOnce(author);
      const res = await controller.create({ firstName: 'A', lastName: 'B' } as any);
      expect(res).toEqual({ success: true, message: 'Author created successfully', data: author });
    });
  });

  describe('findAll', () => {
    it('delegates to service and returns its result', async () => {
      const result = { success: true } as any;
      mockAuthorService.findAll.mockResolvedValueOnce(result);
      const res = await controller.findAll(1 as any, 10 as any, 'q' as any);
      expect(res).toBe(result);
      expect(mockAuthorService.findAll).toHaveBeenCalledWith({ page: 1, limit: 10, search: 'q' });
    });
  });

  describe('findOne', () => {
    it('throws BAD_REQUEST for invalid id', async () => {
      await expect(controller.findOne('invalid-id')).rejects.toMatchObject({ status: 400, message: 'Invalid ID' });
    });

    it('throws NOT_FOUND when service returns null', async () => {
      mockAuthorService.findOne.mockResolvedValueOnce(null);
      await expect(controller.findOne(mockAuthorId)).rejects.toMatchObject({ status: 404, message: 'Author not found' });
    });

    it('returns success response on findOne', async () => {
      const author = { _id: 'a1' } as any;
      mockAuthorService.findOne.mockResolvedValueOnce(author);
      const res = await controller.findOne(mockAuthorId);
      expect(res).toEqual({ success: true, message: 'Author found successfully', data: author });
    });
  });

  describe('update', () => {
    it('throws BAD_REQUEST for invalid id', async () => {
      await expect(controller.update('invalid-id', {} as any)).rejects.toMatchObject({ status: 400, message: 'Invalid ID' });
    });

    it('throws NOT_FOUND when author missing before update', async () => {
      mockAuthorService.findOne.mockResolvedValueOnce(null);
      await expect(controller.update(mockAuthorId, {} as any)).rejects.toMatchObject({ status: 404, message: 'Author not found' });
    });

    it('returns success response on update', async () => {
      mockAuthorService.findOne.mockResolvedValueOnce({ _id: 'a1' } as any);
      const updated = { _id: 'a1', firstName: 'N' } as any;
      mockAuthorService.update.mockResolvedValueOnce(updated);
      const res = await controller.update(mockAuthorId, { firstName: 'N' } as any);
      expect(res).toEqual({ success: true, message: 'Author updated successfully' });
    });
  });

  describe('remove', () => {
    it('throws BAD_REQUEST for invalid id', async () => {
      await expect(controller.remove('invalid-id')).rejects.toMatchObject({ status: 400, message: 'Invalid ID' });
    });

    it('throws NOT_FOUND when author missing before delete', async () => {
      mockAuthorService.findOne.mockResolvedValueOnce(null);
      await expect(controller.remove(mockAuthorId)).rejects.toMatchObject({ status: 404, message: 'Author not found' });
    });

    it('returns success response on remove', async () => {
      mockAuthorService.findOne.mockResolvedValueOnce({ _id: 'a1' } as any);
      mockAuthorService.remove.mockResolvedValueOnce(undefined);
      const res = await controller.remove(mockAuthorId);
      expect(res).toEqual({ success: true, message: 'Author deleted successfully' });
    });
  });
});
