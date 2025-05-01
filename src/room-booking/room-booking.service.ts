import { Injectable } from '@nestjs/common';
import { CreateRoomBookingDto } from './dto/create-room-booking.dto';
import { UpdateRoomBookingDto } from './dto/update-room-booking.dto';

@Injectable()
export class RoomBookingService {
  create(createRoomBookingDto: CreateRoomBookingDto) {
    return 'This action adds a new roomBooking';
  }

  findAll() {
    return `This action returns all roomBooking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} roomBooking`;
  }

  update(id: number, updateRoomBookingDto: UpdateRoomBookingDto) {
    return `This action updates a #${id} roomBooking`;
  }

  remove(id: number) {
    return `This action removes a #${id} roomBooking`;
  }
}
