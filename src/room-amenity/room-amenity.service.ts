import { Injectable } from '@nestjs/common';
import { CreateRoomAmenityDto } from './dto/create-room-amenity.dto';
import { UpdateRoomAmenityDto } from './dto/update-room-amenity.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomAmenityResponseDto } from './dto/response';

@Injectable()
export class RoomAmenityService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createRoomAmenityDto: CreateRoomAmenityDto) {
    return await this.prisma.roomAmenity.create({
      data: createRoomAmenityDto,
    });
  }

  async findOne(id: number) {
    return await this.prisma.roomAmenity.findUnique({
      where: { id },
    });
  }

  // Tìm tất cả RoomAmenity theo roomId (khóa phụ)
  async findByRoomId(roomId: number): Promise<RoomAmenityResponseDto[]> {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
    });
    if (!room) {
      throw new Error('Room not found');
    }

    const roomAmenities = await this.prisma.roomAmenity.findMany({
      where: { roomId },
    });
    return roomAmenities.map((amenity) => new RoomAmenityResponseDto(amenity));
  }

  async update(id: number, updateRoomAmenityDto: UpdateRoomAmenityDto) {
    return await this.prisma.roomAmenity.update({
      where: { id },
      data: updateRoomAmenityDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.roomAmenity.delete({
      where: { id },
    });
  }
}
