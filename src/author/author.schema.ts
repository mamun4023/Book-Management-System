import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema({ timestamps: true }) 
export class Author extends Document {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String })
  bio?: string;

  @Prop({ type: Date })
  birthDate?: Date;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
