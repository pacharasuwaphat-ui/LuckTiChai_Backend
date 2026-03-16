import { Injectable } from '@nestjs/common';
import { CardDto } from './dto/card.dto';
import tarotData from '../../data/major_arcana_meanings_th.json';

@Injectable()
export class FortuneService {


  cardFortune(cardDto: CardDto) {
    const { Present, Advice, Outcome } = cardDto; 
    // Here you can implement your logic to generate a fortune based on the card details

    return {
      message : "Your fortune has been generated based on the card details you provided.",
      readings: `ในช่วงเวลานี้ ${tarotData[Present].present}
สิ่งที่ควรพิจารณาหรือให้ความสำคัญคือ ${tarotData[Advice].advice}
หากคุณสามารถรับมือกับสถานการณ์นี้ได้ แนวโน้มของเรื่องราวมีโอกาสที่จะพัฒนาไปสู่ ${tarotData[Outcome].outcome}`
    };
  }


}
