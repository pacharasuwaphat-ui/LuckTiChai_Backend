import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FortuneHistoryDocument = FortuneHistory & Document;

@Schema({timestamps: true,  collection: 'history' })
export class FortuneHistory {
  @Prop({ index: true, required: true })
  userId: string;

  @Prop({ enum: ['card'], required: true })
  type: string;

  @Prop({ type: {
        present: { type: String, required: true },
        advice: { type: String, required: true },
        outcome: { type: String, required: true },
    }, 
    required: function () {
        return this.type === 'card';
    },
})
  cards: {
    present: string;
    advice: string;
    outcome: string;
  };

  @Prop({ required: true })
  reading: string;
}

export const FortuneHistorySchema = SchemaFactory.createForClass(FortuneHistory);