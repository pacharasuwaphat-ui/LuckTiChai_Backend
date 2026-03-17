import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FortuneHistory, FortuneHistorySchema } from './schema/history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FortuneHistory.name, schema: FortuneHistorySchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class HistoryModule {}