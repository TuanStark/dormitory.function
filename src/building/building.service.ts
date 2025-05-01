import { Injectable } from '@nestjs/common';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { PaginationParams, paginate } from 'src/common/utils/pagination.util';
import { BuildingWithAverageRatingDto } from './dto/oustanding-building.dto';

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

  async getBuildingsWithHighestAverageRating(limit: number = 10): Promise<BuildingWithAverageRatingDto[]> {
    // Lấy danh sách tòa nhà, sắp xếp theo averageRating giảm dần
    const buildings = await this.prisma.building.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        description: true,
        latitude: true,
        address: true,
        longitude: true,
        floors: true,
        averageRating: true,
      },
      orderBy: {
        averageRating: 'desc',
      },
      take: limit,
    });

    // Chuyển đổi sang DTO
    return buildings.map((building) => new BuildingWithAverageRatingDto(building));
  }

}
