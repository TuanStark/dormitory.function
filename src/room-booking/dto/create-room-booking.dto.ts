import { IsNotEmpty, IsNumber, IsDateString, IsOptional, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class UserInfoDto {
  @IsOptional()
  fullName?: string;

  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  identityCard?: string;

  @IsOptional()
  address?: string;

  @IsOptional()
  note?: string;
}

export class CreateRoomBookingDto {
  @IsNotEmpty()
  @IsNumber()
  roomId: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsDateString()
  checkInDate: Date;

  @IsOptional()
  @IsNumber()
  stayDuration?: number; // Số tháng ở

  @IsOptional()
  @IsNumber()
  totalAmount?: number; // Tổng tiền = giá phòng * số tháng

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UserInfoDto)
  userInfo?: UserInfoDto;
}
