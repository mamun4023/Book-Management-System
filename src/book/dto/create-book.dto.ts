import { IsNotEmpty, IsOptional, IsString, IsDateString, Matches } from 'class-validator';
import { Types } from 'mongoose';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{3}-\d{1,5}-\d{1,7}-\d{1,7}-\d{1}$/, {
    message: 'ISBN must be in the format 978-3-16-148410-0',
  })
  isbn: string;

  @IsOptional()
  @IsDateString()
  publishedDate?: Date;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsNotEmpty()
  authorId: Types.ObjectId;
}
