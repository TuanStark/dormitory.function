import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationParams, paginate } from 'src/common/utils/pagination.util';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(params: PaginationParams) {
    // Sử dụng hàm phân trang tổng quát với mô hình building
    // Xác định các trường tìm kiếm cho mô hình building
    const searchFields = ['price', 'status', 'gender'];

    return paginate(
      this.prisma,
      'room',
      params,
      searchFields
    );
  }

  async findOne(id: number) {
    const room = await this.prisma.room.findUnique({
      where: { id },
    });
    return room;
  }


}
