import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FortuneService } from './fortune.service';
import { CardDto } from './dto/card.dto';
import { DiceDto } from './dto/dice.dto';

@Controller('fortune')
export class FortuneController {
  constructor(private readonly fortuneService: FortuneService) {}

  @Post('card')
  cardFortune(@Body() cardDto: CardDto) {
    return this.fortuneService.cardFortune(cardDto);
  }

  @Post('dice')
  DiceFortune(@Body() diceDto: DiceDto) {
    return this.fortuneService.DiceFortune(diceDto);
  }

  @Get('/history/:id')
  getHistoryById(@Param('id') id: string) {
    return this.fortuneService.getHistoryById(id);
  }


}
