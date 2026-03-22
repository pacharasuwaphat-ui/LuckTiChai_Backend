import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, trim: true })
  username: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  // 🔐 reset password
  @Prop({ type: String, default: null })
  resetPasswordToken: string | null;

  @Prop({ type: Date, default: null })
  resetPasswordExpires: Date | null;

  // 🔥 เพิ่มตรงนี้
  @Prop({ type: String, default: null })
  phone: string;

  @Prop({ type: Date, default: null })
  dob: Date; // 

  @Prop({
    type: String,
    default: 'https://ui-avatars.com/api/?name=User',
  })
  profileImage: string; 

  @Prop({ type: Number, default: 0 })
  coin: number;
}

export const UserSchema = SchemaFactory.createForClass(User);