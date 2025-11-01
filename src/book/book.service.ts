import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './book.schema';
import { Model } from 'mongoose';
import { FilterQuery } from 'mongoose';
import { AuthorService } from '../author/author.service';
import { HttpException, HttpStatus } from '@nestjs/common';

interface PaginationOptions {
  page: number;
  limit: number;
  genre?: string;
  authorId?: string;
  search?: string;
}

@Injectable()
export class BookService {
  constructor(@InjectModel(Book.name) private bookModel: Model<Book>, private authorService: AuthorService) { }
  async create(createBookDto: CreateBookDto) {
    const author = await this.authorService.findOne(createBookDto.authorId.toString());
    if (!author) {
      throw new HttpException('Author not found', HttpStatus.NOT_FOUND);
    }

    const existingBook = await this.bookModel.findOne({ isbn: createBookDto.isbn });
    if (existingBook) {
      throw new HttpException('isbn already exists', HttpStatus.BAD_REQUEST);
    }

    const newBook = new this.bookModel({ ...createBookDto, authorId: author._id });
    return newBook.save();
  }

  async findAll(options: PaginationOptions) {
    const { page, limit, genre, authorId, search } = options;

    const filter: FilterQuery<Book> = {};

    // optional filters
    if (genre) filter.genre = genre;
    if (authorId) filter.authorId = authorId;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } },
      ];
    }
    // pagination logic
    const skip = (page - 1) * limit;

    // query
    const [data, total] = await Promise.all([
      this.bookModel
        .find(filter)
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



