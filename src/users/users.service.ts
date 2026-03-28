import {
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schema/users.schema';
import { usersUpdateDto } from './dto/users-update.dto'
import { coinAddDto } from './dto/coin.dto'


@Injectable()
export class UserService {
    constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async BuyCoin(coinDto : coinAddDto){
    const { id , coinAdd } = coinDto;
    const user = await this.userModel.findOne({
      _id: id,
    });
    if (!user) {
      return {
        message: 'user not found.',
      };
    }

    user.coin += coinAdd;
    const coinNow = user.coin;
    await user.save();

    return {
      message: 'Buy coin success.',
      coin : coinNow,
    };

  }

  async updateUsers(updateDto : usersUpdateDto){
    const {  id, username ,phone , dob , profileImage } = updateDto;

    const user = await this.userModel.findOne({
      _id: id,
    });

    if (!user) {
      return {
        message: 'user not found.',
      };
    }

    user.username = username;
    user.phone = phone;
    user.dob = new Date(dob);
    user.profileImage = profileImage;

    await user.save();

    return {
      message: 'user update id saved.',
    };

  }

}
