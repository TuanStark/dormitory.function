import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoomBookingDto } from './dto/create-room-booking.dto';
import { BookingStatus, RoomStatus } from '@prisma/client';

@Injectable()
export class RoomBookingService {
  constructor(private prisma: PrismaService) {}

  async create(createRoomBookingDto: CreateRoomBookingDto) {
    // Kiểm tra phòng có tồn tại không
    const room = await this.prisma.room.findUnique({
      where: { id: createRoomBookingDto.roomId },
      include: { building: true }
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Kiểm tra phòng có trống không
    if (room.status !== RoomStatus.available) {
      throw new BadRequestException('Room is not available');
    }

    // Kiểm tra số người trong phòng
    if (room.currentOccupants >= room.capacity) {
      throw new BadRequestException('Room is full');
    }

    // Tính tổng tiền nếu chưa có
    let totalAmount = createRoomBookingDto.totalAmount;
    if (!totalAmount && createRoomBookingDto.stayDuration) {
      totalAmount = Number(room.price) * createRoomBookingDto.stayDuration;
    }

    // Cập nhật thông tin người dùng nếu có
    if (createRoomBookingDto.userInfo) {
      const { fullName, phoneNumber, email, identityCard, address } = createRoomBookingDto.userInfo;
      
      // Cập nhật thông tin người dùng
      await this.prisma.user.update({
        where: { id: createRoomBookingDto.userId },
        data: {
          fullName: fullName || undefined,
          phoneNumber: phoneNumber || undefined,
          email: email || undefined,
          citizenId: identityCard || undefined,
          address: address || undefined,
        }
      });
    }

    // Tạo booking
    const booking = await this.prisma.roomBooking.create({
      data: {
        userId: createRoomBookingDto.userId,
        roomId: createRoomBookingDto.roomId,
        bookingDate: new Date(),
        status: BookingStatus.pending,
        checkInDate: createRoomBookingDto.checkInDate,
        stayDuration: createRoomBookingDto.stayDuration,
      },
      include: {
        room: {
          include: {
            building: true
          }
        },
        user: true
      }
    });

    return booking;
  }

  async findAll(userId?: number) {
    const where = userId ? { userId } : {};
    
    return this.prisma.roomBooking.findMany({
      where,
      include: {
        room: {
          include: {
            building: true
          }
        },
        user: true,
        payment: true
      },
      orderBy: {
        bookingDate: 'desc'
      }
    });
  }

  async findOne(id: number) {
    const booking = await this.prisma.roomBooking.findUnique({
      where: { id },
      include: {
        room: {
          include: {
            building: true
          }
        },
        user: true,
        payment: true
      }
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async updateStatus(id: number, status: BookingStatus) {
    const booking = await this.prisma.roomBooking.findUnique({
      where: { id },
      include: { room: true }
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Nếu booking được approve, cập nhật trạng thái phòng
    if (status === BookingStatus.approved) {
      await this.prisma.room.update({
        where: { id: booking.roomId },
        data: {
          currentOccupants: {
            increment: 1
          },
          status: booking.room.currentOccupants + 1 >= booking.room.capacity 
            ? RoomStatus.full 
            : RoomStatus.available
        }
      });
    }

    // Cập nhật trạng thái booking
    return this.prisma.roomBooking.update({
      where: { id },
      data: { status },
      include: {
        room: {
          include: {
            building: true
          }
        },
        user: true,
        payment: true
      }
    });
  }
}
