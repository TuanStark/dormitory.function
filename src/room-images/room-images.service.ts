import { Injectable } from '@nestjs/common';
import { CreateRoomImageDto } from './dto/create-room-image.dto';
import { UpdateRoomImageDto } from './dto/update-room-image.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomImageResponseDto } from './dto/response';

@Injectable()
export class RoomImagesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createRoomImageDto: CreateRoomImageDto) {
    return await this.prisma.roomImage.create({
      data: createRoomImageDto,
    });
  }

  async findOne(id: number) {
    return await this.prisma.roomImage.findUnique({
      where: { id },
    });
  }

  async findByRoomId(roomId: number) {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
    });
    if (!room) {
      throw new Error('Room not found');
    }

    const roomImages = await this.prisma.roomImage.findMany({
      where: { roomId },
    });
    return roomImages.map((image) => new RoomImageResponseDto(image));
  }

  async update(id: number, updateRoomImageDto: UpdateRoomImageDto) {
    return await this.prisma.roomImage.update({
      where: { id },
      data: updateRoomImageDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.roomImage.delete({
      where: { id },
    });
  }
}
