import { IsString , IsEmail , IsNotEmpty , Length } from 'class-validator';

export class PhoneDto {
  @IsString()
  @IsNotEmpty()
  @Length(10, 10)
  Phone: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}