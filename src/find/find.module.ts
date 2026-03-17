import { Module } from '@nestjs/common';
import { FindService } from './find.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schema/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [FindService],
  exports: [FindService],
})
export class FindModule {}