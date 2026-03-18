import { IsString , IsEmail , IsInt } from 'class-validator';

export class DiceDto {
  @IsInt()
  Zodiac: number;

   @IsInt()
  Planet: number;
  
  @IsInt()
  House: number;
  
    @IsString()
  userId: string;
}