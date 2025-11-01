import { Test, TestingModule } from '@nestjs/testing';
import { AuthorService } from './author.service';
import { getModelToken } from '@nestjs/mongoose';
import { Author } from './author.schema';

describe('AuthorService', () => {
  let service: AuthorService;
  let mockAuthorModel: any;

  beforeEach(async () => {
    // Build a rich mock resembling a Mongoose Model with chained queries
    mockAuthorModel = {
      create: jest.fn(),
      find: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn(),
      }),
      countDocuments: jest.fn(),
      findById: jest.fn().mockReturnValue({ exec: jest.fn() }),
      findByIdAndUpdate: jest.fn().mockReturnValue({ exec: jest.fn() }),
      findByIdAndDelete: jest.fn().mockReturnValue({ exec: jest.fn() }),
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

  describe('create', () => {
    it('delegates to model.create and returns result', async () => {
      const dto = { firstName: 'A', lastName: 'B' } as any;
      const created = { _id: 'a1', ...dto } as any;
      mockAuthorModel.create.mockResolvedValueOnce(created);
      const res = await service.create(dto);
      expect(res).toBe(created);
      expect(mockAuthorModel.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('returns paginated authors without search filter', async () => {
      // arrange the chained call result
      mockAuthorModel.find.mockReturnValueOnce({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce([{ _id: 'a1' }]),
      });
      mockAuthorModel.countDocuments.mockResolvedValueOnce(1);

      const res = await service.findAll({ page: 1, limit: 10 });
      expect(res).toEqual({
        success: true,
        message: 'Authors fetched successfully',
        total: 1,
        page: 1,
        limit: 10,
        data: [{ _id: 'a1' }],
      });
      expect(mockAuthorModel.find).toHaveBeenCalledWith({});
      expect(mockAuthorModel.countDocuments).toHaveBeenCalledWith({});
    });

    it('applies search filter on firstName/lastName', async () => {
      const exec = jest.fn().mockResolvedValueOnce([]);
      const chain = { skip: jest.fn().mockReturnThis(), limit: jest.fn().mockReturnThis(), sort: jest.fn().mockReturnThis(), exec } as any;
      mockAuthorModel.find.mockReturnValueOnce(chain);
      mockAuthorModel.countDocuments.mockResolvedValueOnce(0);

      await service.findAll({ page: 2, limit: 5, search: 'john' });
      expect(mockAuthorModel.find).toHaveBeenCalledWith({
        $or: [
          { firstName: { $regex: 'john', $options: 'i' } },
          { lastName: { $regex: 'john', $options: 'i' } },
        ],
      });
    });
  });

  describe('findOne', () => {
    it('delegates to findById.exec and returns result', async () => {
      const exec = jest.fn().mockResolvedValueOnce({ _id: 'a1' });
      mockAuthorModel.findById.mockReturnValueOnce({ exec });
      const res = await service.findOne('a1');
      expect(res).toEqual({ _id: 'a1' });
      expect(mockAuthorModel.findById).toHaveBeenCalledWith({ _id: 'a1' });
    });
  });

  describe('update', () => {
    it('delegates to findByIdAndUpdate.exec and returns result', async () => {
      const exec = jest.fn().mockResolvedValueOnce({ _id: 'a1', firstName: 'N' });
      mockAuthorModel.findByIdAndUpdate.mockReturnValueOnce({ exec });
      const res = await service.update('a1', { firstName: 'N' } as any);
      expect(res).toEqual({ _id: 'a1', firstName: 'N' });
      expect(mockAuthorModel.findByIdAndUpdate).toHaveBeenCalledWith({ _id: 'a1' }, { firstName: 'N' });
    });
  });

  describe('remove', () => {
    it('delegates to findByIdAndDelete.exec and returns result', async () => {
      const exec = jest.fn().mockResolvedValueOnce({ acknowledged: true });
      mockAuthorModel.findByIdAndDelete.mockReturnValueOnce({ exec });
      const res = await service.remove('a1');
      expect(res).toEqual({ acknowledged: true });
      expect(mockAuthorModel.findByIdAndDelete).toHaveBeenCalledWith({ _id: 'a1' });
    });
  });
});
