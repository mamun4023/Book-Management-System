import { Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Model } from 'mongoose';
import { Author } from './author.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery } from 'mongoose';

interface PaginationOptions {
  page: number;
  limit: number;
  genre?: string;
  author?: string;
  search?: string;
}

@Injectable()
export class AuthorService {
  constructor(@InjectModel(Author.name) private authorModel: Model<Author>) { }
  create(createAuthorDto: CreateAuthorDto) {
    return this.authorModel.create(createAuthorDto);
  }

  async findAll(options: PaginationOptions) {
    const { page, limit, search } = options;

    const filter: FilterQuery<Author> = {};

    // optional filters
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
      ];
    }

    // pagination logic
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.authorModel
        .find(filter)
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 })
        .exec(),
      this.authorModel.countDocuments(filter),
    ]);

    return {
      success: true,
      message: 'Authors fetched successfully',
      total,
      page: Number(page),
      limit: Number(limit),
      data,
    };
  }

  findOne(id: string) {
    return this.authorModel.findById({ _id: id }).exec();
  }

  update(id: string, updateAuthorDto: UpdateAuthorDto) {
    return this.authorModel.findByIdAndUpdate({ _id: id }, updateAuthorDto).exec();
  }

  remove(id: string) {
    return this.authorModel.findByIdAndDelete({ _id: id }).exec();
  }
}
