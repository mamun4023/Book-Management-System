import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import * as mongoose from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    const book = await this.bookService.create(createBookDto);
    return {
      success: true,
      message: 'Book created successfully',
      data: book,
    }
  }

  @Get()
  async findAll() {
    const books = await this.bookService.findAll();
    return {
      success: true,
      message: 'Books found successfully',
      data: books,
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if(!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    const book = await this.bookService.findOne(id);
    if (!book) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }
    return {
      success: true,
      message: 'Book found successfully',
      data: book,
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    if(!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    const book = await this.bookService.update(id, updateBookDto);
    if (!book) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }
    return {
      success: true,
      message: 'Book updated successfully',
      data: book,
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    if(!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    const book = await this.bookService.findOne(id);
    if (!book) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }
    const deletedBook = await this.bookService.remove(id);
    return {
      success: true,
      message: 'Book deleted successfully',
      data: deletedBook,
    }
  }
}
