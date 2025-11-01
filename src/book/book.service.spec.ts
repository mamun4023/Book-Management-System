import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { AuthorService } from '../author/author.service';
import { getModelToken } from '@nestjs/mongoose';
import { Book } from './book.schema';

describe('BookService', () => {
  let service: BookService;
  let mockBookModel: any;
  const mockAuthorService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    // constructor mock for `new this.bookModel(...)`
    const saveMock = jest.fn();
    mockBookModel = jest.fn().mockImplementation((doc) => ({
      ...doc,
      save: saveMock,
    }));

    // static/query methods used in service
    mockBookModel.findOne = jest.fn();

    const execFindChain = {
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    };
    mockBookModel.find = jest.fn().mockReturnValue(execFindChain);
    mockBookModel.countDocuments = jest.fn();
    mockBookModel.findById = jest.fn().mockReturnValue({ exec: jest.fn() });
    mockBookModel.findByIdAndUpdate = jest.fn().mockReturnValue({ exec: jest.fn() });
    mockBookModel.findByIdAndDelete = jest.fn().mockReturnValue({ exec: jest.fn() });

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

  describe('create', () => {
    it('throws 404 when author not found', async () => {
      (mockAuthorService.findOne as jest.Mock).mockResolvedValueOnce(null);
      await expect(
        service.create({ title: 'T', isbn: 'I', genre: 'G', authorId: '507f1f77bcf86cd799439011' } as any),
      ).rejects.toMatchObject({ status: 404, message: 'Author not found' });
    });

    it('throws 400 when isbn already exists', async () => {
      (mockAuthorService.findOne as jest.Mock).mockResolvedValueOnce({ _id: 'a1' });
      (mockBookModel.findOne as jest.Mock).mockResolvedValueOnce({ _id: 'b1' });
      await expect(
        service.create({ title: 'T', isbn: 'I', genre: 'G', authorId: '507f1f77bcf86cd799439011' } as any),
      ).rejects.toMatchObject({ status: 400, message: 'isbn already exists' });
    });

    it('creates and saves a new book when valid', async () => {
      const author = { _id: 'a1' };
      (mockAuthorService.findOne as jest.Mock).mockResolvedValueOnce(author);
      (mockBookModel.findOne as jest.Mock).mockResolvedValueOnce(null);

      const saved = { _id: 'b1', title: 'T' };
      // replace the constructor's save mock to resolve value
      const instance = new mockBookModel({ title: 'T', isbn: 'I', genre: 'G', authorId: 'a1' });
      instance.save.mockResolvedValueOnce(saved);

      const result = await service.create({ title: 'T', isbn: 'I', genre: 'G', authorId: author._id } as any);
      expect(result).toBe(saved);
      expect(mockBookModel).toHaveBeenCalledWith({ title: 'T', isbn: 'I', genre: 'G', authorId: author._id });
    });
  });

  describe('findAll', () => {
    it('returns paginated list without filters', async () => {
      (mockBookModel.find as jest.Mock).mockReturnValueOnce({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce([{ _id: 'b1' }]),
      });
      (mockBookModel.countDocuments as jest.Mock).mockResolvedValueOnce(1);

      const res = await service.findAll({ page: 1, limit: 10 });
      expect(res.success).toBe(true);
      expect(res.total).toBe(1);
      expect(res.data).toEqual([{ _id: 'b1' }]);
      expect(res.page).toBe(1);
      expect(res.limit).toBe(10);
    });

    it('applies filters (genre, authorId, search)', async () => {
      const exec = jest.fn().mockResolvedValueOnce([]);
      const chain = { skip: jest.fn().mockReturnThis(), limit: jest.fn().mockReturnThis(), sort: jest.fn().mockReturnThis(), exec } as any;
      (mockBookModel.find as jest.Mock).mockReturnValueOnce(chain);
      (mockBookModel.countDocuments as jest.Mock).mockResolvedValueOnce(0);

      await service.findAll({ page: 2, limit: 5, genre: 'F', authorId: 'aid', search: 'title' });
      expect(mockBookModel.find).toHaveBeenCalledWith({
        genre: 'F',
        authorId: 'aid',
        $or: [
          { title: { $regex: 'title', $options: 'i' } },
          { isbn: { $regex: 'title', $options: 'i' } },
        ],
      });
    });
  });

  describe('findOne', () => {
    it('delegates to findById.exec', async () => {
      const exec = jest.fn().mockResolvedValueOnce({ _id: 'b1' });
      (mockBookModel.findById as jest.Mock).mockReturnValueOnce({ exec });
      const res = await service.findOne('b1');
      expect(res).toEqual({ _id: 'b1' });
      expect(mockBookModel.findById).toHaveBeenCalledWith({ _id: 'b1' });
    });
  });

  describe('update', () => {
    it('delegates to findByIdAndUpdate.exec', async () => {
      const exec = jest.fn().mockResolvedValueOnce({ _id: 'b1', title: 'N' });
      (mockBookModel.findByIdAndUpdate as jest.Mock).mockReturnValueOnce({ exec });
      const res = await service.update('b1', { title: 'N' } as any);
      expect(res).toEqual({ _id: 'b1', title: 'N' });
      expect(mockBookModel.findByIdAndUpdate).toHaveBeenCalledWith({ _id: 'b1' }, { title: 'N' });
    });
  });

  describe('remove', () => {
    it('delegates to findByIdAndDelete.exec', async () => {
      const exec = jest.fn().mockResolvedValueOnce({ acknowledged: true });
      (mockBookModel.findByIdAndDelete as jest.Mock).mockReturnValueOnce({ exec });
      const res = await service.remove('b1');
      expect(res).toEqual({ acknowledged: true });
      expect(mockBookModel.findByIdAndDelete).toHaveBeenCalledWith({ _id: 'b1' });
    });
  });
});
