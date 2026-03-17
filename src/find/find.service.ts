import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';
import { Model } from 'mongoose';
import { User } from 'src/users/schema/users.schema';


@Injectable()
export class FindService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async findUser(email: string) {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      return null;
    }

    return user;
  }
}