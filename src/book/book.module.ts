import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BookSchema, Book } from './book.schema';
import { AuthorService } from '../author/author.service';
import { AuthorSchema, Author } from '../author/author.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]), MongooseModule.forFeature([{ name: Author.name, schema: AuthorSchema }])],
  controllers: [BookController],
  providers: [BookService, AuthorService],
})
export class BookModule { }
