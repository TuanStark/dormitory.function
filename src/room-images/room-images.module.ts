import { Module } from '@nestjs/common';
import { RoomImagesService } from './room-images.service';
import { RoomImagesController } from './room-images.controller';

@Module({
  controllers: [RoomImagesController],
  providers: [RoomImagesService],
})
export class RoomImagesModule {}
