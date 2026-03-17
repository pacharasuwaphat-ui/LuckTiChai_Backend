import { Injectable } from '@nestjs/common';
import { CardDto } from './dto/card.dto';
import tarotData from '../../data/major_arcana_meanings_th.json';
import { FortuneHistory, FortuneHistoryDocument } from '../history/schema/history.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FindService } from 'src/find/find.service';

@Injectable()
export class FortuneService {
    constructor(
    @InjectModel(FortuneHistory.name) 
    private fortuneHistoryModel: Model<FortuneHistoryDocument>,
    private findService: FindService,
  ) {}

  async cardFortune(cardDto: CardDto) {
    const { Present, Advice, Outcome , userId} = cardDto; 
    // Here you can implement your logic to generate a fortune based on the card details

    const newFortuneHistory = await this.fortuneHistoryModel.create({
      userId: userId,
      type: 'card',
      cards: {
        present: Present,
        advice: Advice,
        outcome: Outcome,
      },
      reading: `ในช่วงเวลานี้ ${tarotData[Present].present}
สิ่งที่ควรพิจารณาหรือให้ความสำคัญคือ ${tarotData[Advice].advice}
หากคุณสามารถรับมือกับสถานการณ์นี้ได้ แนวโน้มของเรื่องราวมีโอกาสที่จะพัฒนาไปสู่ ${tarotData[Outcome].outcome}`
    });
    return {
      message : "Your fortune has been generated based on the card details you provided.",
      readings: newFortuneHistory.reading,
    };
  }

  async getHistoryById(id: string) {
    const history = await this.fortuneHistoryModel
      .find({ userId: id })
      .sort({ createdAt: -1 }) // 🔥 ใหม่ → เก่า
      .exec();

    if (!history || history.length === 0) {
      return { message: 'History not found' };
    }
    
    return history;
  }


}
