import {  IsNotEmpty, IsString, IsDateString , Length } from 'class-validator';

export class usersUpdateDto {

  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(10)
  phone: string;

  @IsDateString()
  @IsNotEmpty()
  dob: Date;

  @IsString()
  @IsNotEmpty()
  profileImage: string;
}