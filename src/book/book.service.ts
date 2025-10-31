import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './book.schema';
import { Model } from 'mongoose';

@Injectable()
export class BookService {
  constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}
  create(createBookDto: CreateBookDto) {
    const book = new this.bookModel(createBookDto);
    return book.save();
  }

  findAll() {
    return this.bookModel.find().exec();
  }

  findOne(id: string) {
    return this.bookModel.findById({ _id: id }).exec();
  }

  update(id: string, updateBookDto: UpdateBookDto) {
    return this.bookModel.findByIdAndUpdate({ _id: id }, updateBookDto).exec();
  }

  remove(id: string) {
    return this.bookModel.findByIdAndDelete({ _id: id }).exec();
  }
}
