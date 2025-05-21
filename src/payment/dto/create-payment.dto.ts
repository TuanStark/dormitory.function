import { IsNumber, IsString, IsOptional, IsEnum } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

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

export class CreateBankTransferDto {
  @IsNumber()
  amount: number;

  @IsNumber()
  bookingId: number;

  @IsString()
  @IsOptional()
  bankName?: string;

  @IsString()
  @IsOptional()
  accountNumber?: string;

  @IsString()
  @IsOptional()
  accountName?: string;

  @IsString()
  @IsOptional()
  transactionCode?: string;

  @IsString()
  @IsOptional()
  note?: string;
} 