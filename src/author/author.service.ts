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
    return this.authorModel.create(createAuthorDto);
  }

  findAll() {
    return this.authorModel.find().exec();
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
