import { IsNumber, IsString, Min } from "class-validator";

export class CreatePaymentDto {
  
  @IsString()
  userId: string;

  @IsNumber()
  @Min(1)
  amount: number;
}