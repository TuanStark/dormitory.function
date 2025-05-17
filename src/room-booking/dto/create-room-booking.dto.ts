import { IsNotEmpty, IsNumber, IsDateString, IsOptional } from 'class-validator';

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
}
