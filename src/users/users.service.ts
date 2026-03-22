import {
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schema/users.schema';
import { usersUpdateDto } from './dto/users-update.dto'


@Injectable()
export class UserService {
    constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async updateUsers(updateDto : usersUpdateDto){
    const {  id, username ,phone , dob , profileImage } = updateDto;

    const user = await this.userModel.findOne({
      id: id,
    });

    if (!user) {
      return {
        message: 'user not found.',
      };
    }

    user.username = username;
    user.phone = phone;
    user.dob = new Date(dob);

  }

}
