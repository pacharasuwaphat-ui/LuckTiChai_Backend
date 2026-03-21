import { CardDto } from './dto/card.dto';
import { DiceDto } from './dto/dice.dto';
import { SiamsiDto } from './dto/siamsi.dto';

import tarotData from '../../data/major_arcana_meanings_th.json';
import diceData from '../../data/dice_prediction_1728.json';
import siamsiData from '../../data/siamsi.json';

import { FortuneHistory, FortuneHistoryDocument } from '../history/schema/history.schema';

import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { FindService } from 'src/find/find.service';
import { read } from 'fs';

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

  async DiceFortune(diceDto: DiceDto) {
    const { Zodiac, Planet, House , userId} = diceDto;

    const resultDice = diceData.find(item => 
      item.zodiac_id === Zodiac && 
      item.planet_id === Planet && 
      item.house_id === House);

    if (!resultDice) {
      throw new Error('ไม่พบคำทำนายที่ตรงกับข้อมูลนี้');
    }
    
    // save to history
    const newFortuneHistory = await this.fortuneHistoryModel.create({
      userId: userId,
      type: 'dice',
      dice: {
        dice_id : {
          zodiac: Zodiac,
          planet: Planet,
          house: House,
        },
        dice_name: {
          zodiac: resultDice.zodiac,
          planet: resultDice.planet,
          house: resultDice.house,
        },
        dice_advice: resultDice.advice,
      },
      reading: resultDice.prediction
    });

    return {
      message : "api can receive dice fortune",  
      zodiac_name : resultDice.zodiac,
      planet_name : resultDice.planet,
      house_name : resultDice.house,
      readings: newFortuneHistory.reading,
      advice: resultDice.advice
    };

  }

  async siamsiFortune(siamsiDto: SiamsiDto) {
    const { SiamsiNumber , userId } = siamsiDto;
    
    const resultSiamsi = siamsiData.find(item => item.id === SiamsiNumber);

    if (!resultSiamsi) {
      throw new Error('ไม่พบคำทำนายที่ตรงกับข้อมูลนี้');
    }

    // save to history
    const newFortuneHistory = await this.fortuneHistoryModel.create({
      userId: userId,
      type: 'siamsi',
      siamsi: {
        siamsi_number: SiamsiNumber,
        siamsi_advice: resultSiamsi.advice,
        siamsi_level: resultSiamsi.level,
      },
      reading: resultSiamsi.prediction
    });

    return {
      message : "Your fortune has been generated based on the Siamsi number you provided.",
      advice: resultSiamsi.advice,
      level: resultSiamsi.level,
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
