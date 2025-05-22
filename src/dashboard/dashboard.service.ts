import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getStats() {
    const stats = await this.caculateStatus();
    return stats;
  }  

  async caculateStatus() {
    const [
      totalUsers, 
      totalBooking, 
      totalBuildings,
      totalRooms,
      totalBookingCompleted,
      totalAvailableRoom,
      totalAmount,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.roomBooking.count(),
      this.prisma.building.count(),
      this.prisma.room.count(),
      this.prisma.roomBooking.count({
        where: {
          status: 'approved',
        },
      }),
      this.prisma.room.count({
        where:{
          status: 'available',
        }
      }),
      this.prisma.payment.aggregate({
        _sum: {
          amount: true,
        },
      }),
    ])
    return {
      totalUsers,
      totalBooking,
      totalBuildings,
      totalRooms,
      totalBookingCompleted,
      totalAvailableRoom,
      totalAmount,
    }
  }

  async getRecentBookings(limit = 5) {
    return this.prisma.roomBooking.findMany({
      take: limit,
      orderBy: { createAt: 'desc' },
      include: {
        user: {
          select: { id: true, fullName: true, email: true }
        },
        room: {
          select: { id: true, roomNumber: true, price: true }
        }
      }
    });
  }
}
