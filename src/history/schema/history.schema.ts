import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FortuneHistoryDocument = FortuneHistory & Document;

@Schema({timestamps: true,  collection: 'history' })
export class FortuneHistory {
  @Prop({ index: true, required: true })
  userId: string;

  @Prop({ enum: ['card' , 'dice' , 'siamsi' , 'phone' , 'dmy'], required: true })
  type: string;

  @Prop({ type: 
      {
          present: { type: String, required: true },
          advice: { type: String, required: true },
          outcome: { type: String, required: true },
      }, 
      required: function () {
          return this.type === 'card';
      },})
  cards: {
    present: string;
    advice: string;
    outcome: string;
  };

  @Prop({ type: 
      {
          siamsi_number: { type: Number, required: true },
          siamsi_advice: { type: String, required: true },
          siamsi_level: { type: String, required: true },
      }, 
      required: function () {
          return this.type === 'siamsi';
      },})
  siamsi: {
    siamsi_number: number;
    siamsi_advice: string;
    siamsi_level: string;
  };

  @Prop({ type: 
      {
          phone_number: { type: String, required: true },
          score : { type: Number, required: true },
          title : { type: String, required: true },
          phone_advice: { type: String, required: true },
      }, 
      required: function () {
          return this.type === 'phone';
      },})
  phone: {
    phone_number: string;
    score: number;
    title: string;
    phone_advice: string;
  };

  @Prop({ type: 
      {
          dice_id:{
            zodiac: { type: Number, required: true },
            planet: { type: Number, required: true },
            house: { type: Number, required: true },
          },
          dice_name : {
            zodiac: { type: String, required: true },
            planet: { type: String, required: true },
            house: { type: String, required: true },
          },
          dice_advice: { type: String, required: true },
      }, 
      required: function () {
          return this.type === 'dice';
      },})
  dice: {
    zodiac: number;
    planet: number;
    house: number;
  };


  @Prop({ required: true })
  reading: string;
}

export const FortuneHistorySchema = SchemaFactory.createForClass(FortuneHistory);