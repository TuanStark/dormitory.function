import { Injectable } from '@nestjs/common';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { PaginationParams, paginate } from 'src/common/utils/pagination.util';

@Injectable()
export class BuildingService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: PaginationParams) {
    // Sử dụng hàm phân trang tổng quát với mô hình building
    // Xác định các trường tìm kiếm cho mô hình building
    const searchFields = ['name', 'description'];
    
    return paginate(
      this.prisma,
      'building',
      params,
      searchFields
    );
  }

  async findOne(id: number) {
    const building = await this.prisma.building.findUnique({
      where: { id }
    });
    return building;
  }

}
