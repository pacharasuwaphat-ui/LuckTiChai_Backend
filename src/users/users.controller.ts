import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './users.service'
import { usersUpdateDto } from './dto/users-update.dto';
import { coinAddDto } from './dto/coin.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

    @Post('add-coin')
    BuyCoin(@Body() coinDto: coinAddDto) {
        return this.userService.BuyCoin(coinDto);
    }

    @Post('update')
    updateUsers(@Body() updateDto: usersUpdateDto) {
        return this.userService.updateUsers(updateDto);
    }

}
