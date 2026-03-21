import {IsInt, IsString } from 'class-validator';

export class SiamsiDto {
  @IsInt()
  SiamsiNumber: number;

  @IsString()
  userId: string;
}