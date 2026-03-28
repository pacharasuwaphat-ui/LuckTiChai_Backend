import {  IsNotEmpty, IsString, IsDateString , Length, IsNumber  } from 'class-validator';

export class coinAddDto {

  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNumber()
  @IsNotEmpty()
  coinAdd: number;

}