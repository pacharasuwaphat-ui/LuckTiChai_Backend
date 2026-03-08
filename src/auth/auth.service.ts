import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/schema/users.schema';

@Injectable()
export class AuthService {
    constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  
  async register(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;

    const existingUser = await this.userModel.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userModel.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    return {
      message: 'Register success',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    };
  }
}
