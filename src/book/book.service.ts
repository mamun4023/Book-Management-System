import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './book.schema';
import { Model } from 'mongoose';
import { FilterQuery } from 'mongoose';

interface PaginationOptions {
  page: number;
  limit: number;
  genre?: string;
  author?: string;
  search?: string;
}


@Injectable()
export class BookService {
  constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}
  create(createBookDto: CreateBookDto) {
    const book = new this.bookModel(createBookDto);
    return book.save();
  }

  async findAll(options: PaginationOptions) {
    const { page, limit, genre, author, search } = options;

    const filter: FilterQuery<Book> = {};

    // optional filters
    if (genre) filter.genre = genre;
    if (author) filter.author = author;
    if (search) filter.title = { $regex: search, $options: 'i' }; // case-insensitive search

    // pagination logic
    const skip = (page - 1) * limit;

    // query
    const [data, total] = await Promise.all([
      this.bookModel
        .find(filter)
        .populate('author')
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 })
        .exec(),
      this.bookModel.countDocuments(filter),
    ]);

    return {
      success: true,
      message: 'Books fetched successfully',
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
      data,
    };
  }

 async findOne(id: string) {
    return this.bookModel.findById({ _id: id }).exec();
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    return this.bookModel.findByIdAndUpdate({ _id: id }, updateBookDto).exec();
  }

  async remove(id: string) {
    return this.bookModel.findByIdAndDelete({ _id: id }).exec();
  }
}



