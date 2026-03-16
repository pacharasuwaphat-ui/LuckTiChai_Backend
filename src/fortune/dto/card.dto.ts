import { IsString } from 'class-validator';

export class CardDto {
  @IsString()
  Present: string;

   @IsString()
  Advice: string;
  
   @IsString()
  Outcome: string;
}