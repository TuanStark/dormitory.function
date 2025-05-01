import { Module } from '@nestjs/common';
import { RoomBookingService } from './room-booking.service';
import { RoomBookingController } from './room-booking.controller';

@Module({
  controllers: [RoomBookingController],
  providers: [RoomBookingService],
})
export class RoomBookingModule {}
