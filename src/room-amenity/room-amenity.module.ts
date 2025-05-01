import { Module } from '@nestjs/common';
import { RoomAmenityService } from './room-amenity.service';
import { RoomAmenityController } from './room-amenity.controller';

@Module({
  controllers: [RoomAmenityController],
  providers: [RoomAmenityService],
})
export class RoomAmenityModule {}
