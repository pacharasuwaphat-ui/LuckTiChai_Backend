import {  IsNotEmpty, IsString, IsDateString , Length, Matches  } from 'class-validator';

export class usersUpdateDto {

  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @Matches(/^[0-9]{10}$/)
  phone: string;

  @IsDateString()
  @IsNotEmpty()
  dob: string;

  @IsString()
  @IsNotEmpty()
  profileImage: string;
}