import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoomBookingDto } from './dto/create-room-booking.dto';
import { BookingStatus, RoomStatus } from '@prisma/client';
import { FindAllDto } from 'src/room/dto/findall-room.dto';

@Injectable()
export class RoomBookingService {
  constructor(private prisma: PrismaService) {}

  async create(createRoomBookingDto: CreateRoomBookingDto) {
    // console.log(createRoomBookingDto);
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
      totalAmount = Number(room.price) * (createRoomBookingDto.stayDuration/30);
    }

    // Ensure userId is a valid integer
    const userId = Number(createRoomBookingDto.userId);
    if (isNaN(userId) || userId <= 0 || !Number.isInteger(userId)) {
      throw new BadRequestException('Invalid user ID');
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
        userId: userId,
        roomId: createRoomBookingDto.roomId,
        bookingDate: new Date(),
        status: BookingStatus.pending,
        checkInDate: createRoomBookingDto.checkInDate,
        stayDuration: createRoomBookingDto.stayDuration,
        totalAmount: totalAmount || 0
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

  async findAllBooking(query: FindAllDto) {
    const { 
      page = 1, 
      limit = 5, 
      search, 
      sortBy = 'createAt', 
      sortOrder = 'desc'
    } = query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (pageNumber < 1 || limitNumber < 1) {
      throw new Error('Page and limit must be greater than 0');
    }

    const take = limitNumber;
    const skip = (pageNumber - 1) * limitNumber;

    const where = search ? {
      OR:[
        {
          room: {
            roomNumber: {
              contains: search,
            }
          }
        }
      ]
    } : {};

    const orderBy = {
      [sortBy]: sortOrder
    };

    const [roomBookings, total] = await Promise.all([
      this.prisma.roomBooking.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          room: {
            include: {
              building: true
            }
          },
          user: true,
          payment: true
        }
      }),
      this.prisma.roomBooking.count({
        where
      })
    ]);

    return {
      data: roomBookings,
      meta: {
        total,
        pageNumber,
        limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
    
  }

  async findBookingsByUserId(userId: number) {
    // Ensure userId is a valid integer
    const userIdNum = Number(userId);
    if (isNaN(userIdNum) || userIdNum <= 0 || !Number.isInteger(userIdNum)) {
      throw new BadRequestException('Invalid user ID');
    }

    // Get all bookings for the user
    const bookings = await this.prisma.roomBooking.findMany({
      where: {
        userId: userIdNum
      },
      include: {
        room: true
      },
      orderBy: {
        bookingDate: 'desc'
      }
    });

    return bookings;
  }
}
