import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BuildingWithAverageRatingDto } from './dto/oustanding-building.dto';
import { FindAllBuildingDto } from './dto/find-all-building.dto';
import { CreateBuildingDto } from './dto/create-building.dto';

@Injectable()
export class BuildingService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: FindAllBuildingDto) {
    const {
      search,
      location,
      minPrice,
      maxPrice,
      gender,
      amenities,
      sortOption,
      page = 1,
      limit = 10,
    } = query;

    // Ensure page and limit are numbers
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    // Build the where clause for filtering
    const where = {
      AND: [
        search ? {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
          ],
        } : {},
        location ? { address: { contains: location } } : {},
        (minPrice || maxPrice) ? {
          rooms: {
            some: {
              price: {
                ...(minPrice && { gte: Number(minPrice) }),
                ...(maxPrice && { lte: Number(maxPrice) }),
              },
            },
          },
        } : {},
        gender ? {
          rooms: {
            some: { gender },
          },
        } : {},
        amenities && amenities.length > 0 ? {
          rooms: {
            some: {
              amenities: {
                some: {
                  amenityName: {
                    in: Array.isArray(amenities) ? amenities : [amenities],
                  },
                },
              },
            },
          },
        } : {},
      ],
    };

    // Always get all buildings for price sorting, else use pagination
    let buildings: any[] = [];
    let total = 0;
    if (sortOption === 'Giá: Thấp đến cao' || sortOption === 'Giá: Cao đến thấp') {
      buildings = await this.prisma.building.findMany({
        where,
        include: {
          rooms: { include: { amenities: true, images: true } },
        },
      });
      // Sort by min/max room price
      if (sortOption === 'Giá: Thấp đến cao') {
        buildings.sort((a, b) => {
          const minA = Math.min(...a.rooms.map(r => Number(r.price)));
          const minB = Math.min(...b.rooms.map(r => Number(r.price)));
          return minA - minB;
        });
      } else {
        buildings.sort((a, b) => {
          const maxA = Math.max(...a.rooms.map(r => Number(r.price)));
          const maxB = Math.max(...b.rooms.map(r => Number(r.price)));
          return maxB - maxA;
        });
      }
      total = buildings.length;
      // Apply pagination after sorting
      buildings = buildings.slice((pageNum - 1) * limitNum, pageNum * limitNum);
    } else {
      // Other sort options: sort in DB
      let orderBy = {};
      switch (sortOption) {
        case 'Đánh giá cao nhất':
          orderBy = { averageRating: 'desc' };
          break;
        case 'Mới nhất':
        case 'Mặc định':
        default:
          orderBy = { createAt: 'desc' };
      }
      [buildings, total] = await Promise.all([
        this.prisma.building.findMany({
          where,
          orderBy,
          skip: (pageNum - 1) * limitNum,
          take: limitNum,
          include: {
            rooms: { include: { amenities: true, images: true } },
          },
        }),
        this.prisma.building.count({ where }),
      ]);
    }

    return {
      data: buildings,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    };
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
      orderBy: {
        averageRating: 'desc',
      },
      include: {
        rooms: {
          include: {
            amenities: true,
            images: true,
          },
        },
      },
      take: limit,
    });

    // Chuyển đổi sang DTO
    return buildings.map((building) => new BuildingWithAverageRatingDto(building));
  }

  // Tìm kiếm và lọc nhà trọ theo nhiều điều kiện
  async searchBuildings(searchParams: any, sortOption: string, page = 1, limit = 10) {
    // Các tham số tìm kiếm có thể undefined hoặc null
    const { search, location, minPrice, maxPrice, gender, amenities, noFilterProvided } = searchParams;
    
    // Xây dựng điều kiện tìm kiếm
    const where: any = {};
    
    // Nếu không có điều kiện lọc nào, sẽ trả về tất cả building
    // Trong trường hợp này, where sẽ là một object rỗng, Prisma sẽ trả về tất cả các records
    // Chỉ thêm các điều kiện tìm kiếm nếu có điều kiện lọc
    if (!noFilterProvided) {
      // Tìm kiếm theo tên hoặc địa chỉ - chỉ thêm nếu có giá trị
      if (search && search.trim()) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      // Lọc theo khu vực - chỉ thêm nếu có giá trị
      if (location && location.trim()) {
        where.address = { contains: location, mode: 'insensitive' };
      }
      
      // Biến chứa các điều kiện cho phòng (có thể trống nếu không có điều kiện nào)
      const roomConditions: any = {};
      let hasRoomConditions = false;
      
      // Lọc theo giá - chỉ thêm nếu có giá trị hợp lệ
      if (minPrice !== undefined && minPrice !== null && !isNaN(minPrice) || 
          maxPrice !== undefined && maxPrice !== null && !isNaN(maxPrice)) {
        
        roomConditions.price = {};
        hasRoomConditions = true;
        
        if (minPrice !== undefined && minPrice !== null && !isNaN(minPrice)) {
          roomConditions.price.gte = minPrice;
        }
        
        if (maxPrice !== undefined && maxPrice !== null && !isNaN(maxPrice)) {
          roomConditions.price.lte = maxPrice;
        }
      }
      
      // Lọc theo giới tính - chỉ thêm nếu có giá trị
      if (gender) {
        roomConditions.gender = gender;
        hasRoomConditions = true;
      }
      
      // Chỉ thêm điều kiện rooms vào where nếu có ít nhất một điều kiện
      if (hasRoomConditions) {
        where.rooms = {
          some: roomConditions
        };
      }
      
      // Lọc theo tiện ích - chỉ thêm nếu có giá trị
      if (amenities && Array.isArray(amenities) && amenities.length > 0) {
        // Xuất hiện lần đầu tiên của điều kiện rooms
        if (!where.rooms) {
          where.rooms = { some: {} };
        }
        
        // Định nghĩa điều kiện amenities cho phòng
        where.rooms.some = {
          ...where.rooms.some,
          amenities: {
            some: {
              amenityName: {
                in: amenities.filter(a => a && a.trim())
              }
            }
          }
        };
      }
    }
    
    // Xác định tham số sắp xếp
    let orderBy = {};
    switch (sortOption) {
      case 'Giá: Thấp đến cao':
        orderBy = {
          rooms: {
            some: {},
            orderBy: {
              price: 'asc',
            },
          },
        };
        break;
      case 'Giá: Cao đến thấp':
        orderBy = {
          rooms: {
            some: {},
            orderBy: {
              price: 'desc',
            },
          },
        };
        break;
      case 'Đánh giá cao nhất':
        orderBy = {
          averageRating: 'desc',
        };
        break;
      case 'Mới nhất':
      case 'Mặc định':
      default:
        orderBy = {
          createAt: 'desc',
        };
    }
    
    // Tính toán thông số phân trang
    const skip = (page - 1) * limit;
    
    // Đếm tổng số kết quả
    const totalCount = await this.prisma.building.count({ where });
    
    // Truy vấn danh sách tòa nhà với các điều kiện
    const buildings = await this.prisma.building.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        rooms: {
          include: {
            amenities: true,
            images: {
              take: 1 // Chỉ lấy 1 hình ảnh đầu tiên cho mỗi phòng
            }
          }
        }
      }
    });
    
    // Chuyển đổi kết quả sang định dạng phù hợp với UI
    const formattedBuildings = buildings.map(building => {
      // Tính toán giá thấp nhất và cao nhất
      const prices = building.rooms.map(room => Number(room.price));
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
      const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
      
      // Xác định sức chứa
      const capacities = building.rooms.map(room => room.capacity);
      const minCapacity = capacities.length > 0 ? Math.min(...capacities) : 0;
      const maxCapacity = capacities.length > 0 ? Math.max(...capacities) : 0;
      
      // Tổng hợp các tiện ích
      const allAmenities = new Set<string>();
      building.rooms.forEach(room => {
        room.amenities.forEach(amenity => {
          allAmenities.add(amenity.amenityName);
        });
      });
      
      return {
        id: building.id,
        name: building.name,
        address: building.address,
        image: building.image,
        description: building.description,
        averageRating: building.averageRating,
        reviewCount: building.fiveStar + building.fourStar + building.threeStar + building.twoStar + building.oneStar,
        priceRange: `${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}đ/tháng`,
        capacity: `${minCapacity}-${maxCapacity} người/phòng`,
        amenities: {
          wifi: allAmenities.has('Wifi') || allAmenities.has('wifi'),
          airConditioner: allAmenities.has('Điều hòa') || allAmenities.has('Air Conditioner'),
          service24h: allAmenities.has('Bảo vệ 24/7') || allAmenities.has('Security 24/7'),
          parking: allAmenities.has('Bãi xe') || allAmenities.has('Parking'),
          internet: allAmenities.has('Cáng tin') || allAmenities.has('Internet')
        },
        rooms: building.rooms.map(room => ({
          id: room.id,
          roomNumber: room.roomNumber,
          price: Number(room.price),
          capacity: room.capacity,
          currentOccupants: room.currentOccupants,
          status: room.status,
          gender: room.gender,
          imageUrl: room.images.length > 0 ? room.images[0].url : null
        }))
      };
    });
    
    return {
      data: formattedBuildings,
      pagination: {
        totalCount,
        pageCount: Math.ceil(totalCount / limit),
        currentPage: page,
        perPage: limit
      }
    };
  }
  
  async getRoomsWithDetailsByBuildingId(buildingId: number, limit?: number) {
    // Kiểm tra xem building có tồn tại không
    const building = await this.prisma.building.findUnique({
      where: { id: buildingId },
      select: {
        id: true,
        name: true,
        image: true,
        description: true,
        longitude: true,
        latitude: true,
        address: true,
        floors: true,
        averageRating: true,
      }
    });
    
    if (!building) {
      return null;
    }
    
    // Lấy danh sách các phòng thuộc tòa nhà đó
    const rooms = await this.prisma.room.findMany({
      where: {
        buildingId: buildingId
      },
      include: {
        // Lấy thông tin ảnh của phòng
        images: {
          select: {
            id: true,
            url: true,
            description: true
          }
        },
        // Lấy thông tin tiện ích của phòng
        amenities: {
          select: {
            id: true,
            amenityName: true,
            description: true
          }
        }
      },
      // Thêm limit nếu có
      ...(limit ? { take: limit } : {})
    });
    
    // Trả về kết quả bao gồm thông tin tòa nhà và danh sách phòng với ảnh và tiện ích
    return {
      building,
      rooms
    };
  }

  async createBuilding(data: CreateBuildingDto) {
    const building = await this.prisma.building.create({
      data: {
        ...data, 
      },
    });
    return building;
  }

  async updateBuilding(id: number, data: CreateBuildingDto) {
    const building = await this.prisma.building.update({
      where: { id },
      data,
    });
    return building;
  }

  async deleteBuilding(id: number) {
    const building = await this.prisma.building.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });
    return building;
  }
}
