import { IsString , IsEmail , IsInt } from 'class-validator';

export class GetAdviceDto {
  @IsString()
  fortuneId: string;

}