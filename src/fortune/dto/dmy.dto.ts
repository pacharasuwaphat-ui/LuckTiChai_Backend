import { IsString , IsEmail, IsNotEmpty } from 'class-validator';

export class DmyDto {
    
  @IsNotEmpty()
  @IsString()
  day: string;

  @IsNotEmpty()
  @IsString()
  month: string;
  
  @IsNotEmpty()
  @IsString()
  year: string;
  
  @IsNotEmpty()
  @IsString()
  userId: string;
}