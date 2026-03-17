import { Module } from '@nestjs/common';
import { FortuneService } from './fortune.service';
import { FortuneController } from './fortune.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FortuneHistory, FortuneHistorySchema } from '../history/schema/history.schema';
import { HistoryModule } from '../history/history.module';
import { FindModule } from 'src/find/find.module';


@Module({
  imports: [
    HistoryModule,
    FindModule,
    MongooseModule.forFeature([
      { name: FortuneHistory.name, schema: FortuneHistorySchema },
    ]),
  ],
  controllers: [FortuneController],
  providers: [FortuneService],
})
export class FortuneModule {}
