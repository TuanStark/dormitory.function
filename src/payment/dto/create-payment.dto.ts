import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  amount: number;

  @IsString()
  orderInfo: string;

  @IsString()
  orderType: string;

  @IsString()
  locale: string;

  @IsString()
  returnUrl: string;

  @IsString()
  ipAddr: string;

  @IsNumber()
  @IsOptional()
  bookingId?: number;
} 