import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomBookingService } from './room-booking.service';
import { CreateRoomBookingDto } from './dto/create-room-booking.dto';
import { UpdateRoomBookingDto } from './dto/update-room-booking.dto';

@Controller('room-booking')
export class RoomBookingController {
  constructor(private readonly roomBookingService: RoomBookingService) {}

  @Post()
  create(@Body() createRoomBookingDto: CreateRoomBookingDto) {
    return this.roomBookingService.create(createRoomBookingDto);
  }

  @Get()
  findAll() {
    return this.roomBookingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomBookingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomBookingDto: UpdateRoomBookingDto) {
    return this.roomBookingService.update(+id, updateRoomBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomBookingService.remove(+id);
  }
}
