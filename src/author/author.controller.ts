import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import * as mongoose from 'mongoose';

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) { }

  @Post()
  async create(@Body() createAuthorDto: CreateAuthorDto) {
    const author = await this.authorService.create(createAuthorDto);
    if (!author) {
      throw new HttpException('Author not created', HttpStatus.BAD_REQUEST);
    }

    return {
      success: true,
      message: 'Author created successfully',
      data: author,
    }
  }

  @Get()
  async findAll() {
    const authors = await this.authorService.findAll();
    if (!authors) {
      throw new HttpException('Authors not found', HttpStatus.NOT_FOUND);
    }
    return {
      success: true,
      message: 'Authors found successfully',
      data: authors,
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if(!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    const author = await this.authorService.findOne(id);
    if (!author) {
      throw new HttpException('Author not found', HttpStatus.NOT_FOUND);
    }
    return {
      success: true,
      message: 'Author found successfully',
      data: author,
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
     if(!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    const author = await this.authorService.findOne(id);
    if (!author) {
      throw new HttpException('Author not found', HttpStatus.NOT_FOUND);
    }
    const updatedAuthor = await this.authorService.update(id, updateAuthorDto);
    return {
      success: true,
      message: 'Author updated successfully',
      data: updatedAuthor,
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    if(!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    const author = await this.authorService.findOne(id);
    if (!author) {
      throw new HttpException('Author not found', HttpStatus.NOT_FOUND);
    }
    await this.authorService.remove(id);
    return {
      success: true,
      message: 'Author deleted successfully',
    }
  }
}
