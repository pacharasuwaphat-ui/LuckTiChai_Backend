import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './users.service'
import { usersUpdateDto } from './dto/users-update.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

    @Post('update')
    updateUsers(@Body() updateDto: usersUpdateDto) {
        return this.userService.updateUsers(updateDto);
    }

}
