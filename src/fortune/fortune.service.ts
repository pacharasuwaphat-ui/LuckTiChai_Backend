import { CardDto } from './dto/card.dto';
import { DiceDto } from './dto/dice.dto';
import { SiamsiDto } from './dto/siamsi.dto';
import { PhoneDto } from './dto/phone.dto';
import { DmyDto } from './dto/dmy.dto';
import { GetAdviceDto } from './dto/getadvice.dto';

import tarotData from '../../data/major_arcana_meanings_th.json';
import diceData from '../../data/dice_prediction_1728.json';
import siamsiData from '../../data/siamsi.json';
import phoneData from '../../data/phone_number.json';
import phonePrediction from '../../data/phonepredic.json';
import lifepathData from '../../data/life_path_predictions.json';
import ZodiacData from '../../data/zodiac_signs.json';

import { FortuneHistory, FortuneHistoryDocument } from '../history/schema/history.schema';
import { User } from '../users/schema/users.schema';

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

    @InjectModel(User.name)
    private userModel: Model<User>,

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
      advice: resultDice.advice,
      historyId: newFortuneHistory._id,
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
      historyId: newFortuneHistory._id,
    };
  }

  async phoneFortune(phoneDto: PhoneDto) {
    const { Phone, userId } = phoneDto;

    const last7 = Phone.slice(3);
    const pairs: string[] = [];
    for (let i = 0; i < last7.length - 1; i++) {
      pairs.push(last7[i] + last7[i + 1]);
    }

    let totalScore = 0;

    for (const pair of pairs) {
      const found = phoneData.find(item => item.pair === pair);
      if (found) {
        totalScore += found.score;
      }
    }

    const gradeResult = phonePrediction.grades.find(g =>
      totalScore >= g.min && totalScore <= g.max
    );

    if (!gradeResult) {
      throw new Error('ไม่สามารถประเมินผลได้');
    }
    const newFortuneHistory = await this.fortuneHistoryModel.create({
        userId: userId,
        type: 'phone',
        phone: {
          phone_number: Phone,
          score: totalScore,
          title: gradeResult.title,
          phone_advice: gradeResult.advice,
        },
        reading: gradeResult.prediction
      });

    // ✅ return
    return {
      historyId: newFortuneHistory._id,
      phone: Phone,
      score: totalScore,
      title: gradeResult.title,
      readings: gradeResult.prediction,
      advice: gradeResult.advice
    };
  }

  async dateFortune(dmyDto: DmyDto) {
    const { day, month, year, userId } = dmyDto;


    const d = Number(day);
    const m = Number(month);
    const y = Number(year);
    const dob = `${year}-${month}-${day}`;

    // หา Zodiac
    const date = `${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    const zodiac = ZodiacData.find(z => {
      const { start_date, end_date } = z;
      if (start_date <= end_date) {
        return date >= start_date && date <= end_date;
      }
      return date >= start_date || date <= end_date;
    });

    // 🔹 4. หา Life Path Number
    let sum = dob
      .replace(/\D/g, '')
      .split('')
      .reduce((acc, num) => acc + Number(num), 0);

    while (sum > 9) {
      sum = sum
        .toString()
        .split('')
        .reduce((acc, num) => acc + Number(num), 0);
    }

    const lifePath = sum;

    // 🔹 5. หา prediction
    const prediction = lifepathData.find(
      l => l.life_path_number === lifePath,
    );
    const newFortuneHistory = await this.fortuneHistoryModel.create({
      userId: userId,
      type: 'date',
      dmy: {
        prediction: {
          life_path_number: lifePath,
          title: prediction?.title,
          core_personality: prediction?.core_personality,
          strengths: prediction?.strengths,
          weaknesses: prediction?.weaknesses,
          suitable_careers: prediction?.suitable_careers,
          love_relationships: prediction?.love_relationships,
          advice: prediction?.advice
        },
        dob: dob,
        lucky_colors: zodiac?.lucky_colors || [],
      },
    });

    // 🔥 6. return result
    return {
      userId,
      historyId: newFortuneHistory._id,
      dob,
      lucky_colors: zodiac?.lucky_colors,
      prediction,
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

  async getAdvice(getadvicedto: GetAdviceDto) {
    const { fortuneId } = getadvicedto;
    const history = await this.fortuneHistoryModel.findById
    (fortuneId).exec();

    if (!history) {
      return { message: 'History not found' };
    }

    history.getAdvice = true;
    await history.save();
    const user = await this.userModel.findOne({
      _id: history.userId,
    });
    if (!user) {
      return {
        message: 'user not found.',
      };
    }
    user.coin -= 5;
    await user.save();

    return {
      message: 'Advice has been unlocked for this fortune.',
      coin : user.coin,
    };

  }

  async findFortuneById(id: string) {
    const fortune = await this.fortuneHistoryModel.findById
    (id).exec();
    if (!fortune) {
      return { message: 'Fortune not found' };
    }
    return fortune;
  }


}
