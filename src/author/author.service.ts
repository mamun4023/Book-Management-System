import { Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Model } from 'mongoose';
import { Author } from './author.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthorService {
  constructor(@InjectModel(Author.name) private authorModel: Model<Author>) {}
  create(createAuthorDto: CreateAuthorDto) {
    // return "Author created successfully"
    return this.authorModel.create(createAuthorDto);
  }

  findAll() {
    return this.authorModel.find().exec();
    // return "Authors found successfully"
  }

  findOne(id: number) {
    return this.authorModel.findById(id).exec();
    // return "Author found successfully"
  }

  update(id: number, updateAuthorDto: UpdateAuthorDto) {
    return this.authorModel.findByIdAndUpdate(id, updateAuthorDto).exec();
    // return "Author updated successfully"
  }

  remove(id: number) {
    return this.authorModel.findByIdAndDelete(id).exec();
    // return "Author deleted successfully"
    // return this.authorModel.findByIdAndDelete(id).exec();
  }
}
