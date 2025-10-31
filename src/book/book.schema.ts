import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Author } from '../author/author.schema'; // adjust path if needed

@Schema({ timestamps: true }) // auto-generates createdAt & updatedAt
export class Book extends Document {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    match: [/^\d{3}-\d{1,5}-\d{1,7}-\d{1,7}-\d{1}$/, 'Invalid ISBN format'],
  })
  isbn: string;

  @Prop({ type: Date })
  publishedDate?: Date;

  @Prop({ type: String, enum: ['Fantasy', 'Science Fiction', 'Thriller'], required: false })
  genre?: string;

  @Prop({ type: Types.ObjectId, ref: Author.name, required: true })
  author: Author | Types.ObjectId;
}

export const BookSchema = SchemaFactory.createForClass(Book);

