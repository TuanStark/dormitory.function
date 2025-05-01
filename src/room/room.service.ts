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

  async createRoom(createRoomDto: CreateRoomDto) {
    try {
      // Use a transaction to ensure all operations succeed or fail together
      // Nếu có bất kỳ lỗi nào xảy ra trong transaction, tất cả thay đổi sẽ tự động rollback
      return await this.prisma.$transaction(async (prisma) => {
        // 1. Create the room first
        const room = await prisma.room.create({
          data: {
            buildingId: createRoomDto.buildingId,
            roomNumber: createRoomDto.roomNumber,
            floor: createRoomDto.floor,
            capacity: createRoomDto.capacity,
            gender: createRoomDto.gender,
            price: createRoomDto.price,
            status: createRoomDto.status,
            currentOccupants: 0, // Initialize with 0 occupants
          },
        });

        // 2. Create the room amenities
        if (createRoomDto.amenities && createRoomDto.amenities.length > 0) {
          await Promise.all(
            createRoomDto.amenities.map((amenity) =>
              prisma.roomAmenity.create({
                data: {
                  roomId: room.id,
                  amenityName: amenity.amenityName,
                  description: amenity.description,
                },
              })
            )
          );
        }

        // 3. Handle room images - supporting both direct URLs and Supabase uploads
        if (createRoomDto.images && createRoomDto.images.length > 0) {
          const imagePromises = createRoomDto.images.map(async (image) => {
            let imageUrl = image.url;
            
            // If base64Data and filename are provided, upload to Supabase
            if (image.base64Data && image.filename) {
              // Generate a unique filename to avoid collisions
              const uniqueFilename = `${Date.now()}-${image.filename}`;
            }
            
            // Only create an image record if we have a URL (either from direct input or upload)
            if (imageUrl) {
              return prisma.roomImage.create({
                data: {
                  roomId: room.id,
                  url: imageUrl,
                  description: image.description,
                },
              });
            }
          });
          
          // Filter out undefined promises (in case imageUrl was not available)
          await Promise.all(imagePromises.filter(Boolean));
        }

        // 4. Return the created room with its related amenities and images
        return prisma.room.findUnique({
          where: { id: room.id },
          include: {
            amenities: true,
            images: true,
          },
        });
      });
    } catch (error) {
      // Ở đây, nếu có lỗi xảy ra, transaction đã tự động rollback
      // Tất cả các thay đổi (room, amenities, images) đều được hoàn tác
      console.error('Error creating room:', error);
      throw new Error(`Không thể tạo phòng: ${error.message}`);
    }
  }

  async updateRoom(id: number, updateRoomDto: UpdateRoomDto) {
    try {
      // Sử dụng transaction để đảm bảo tất cả thao tác thành công hoặc thất bại cùng nhau
      return await this.prisma.$transaction(async (prisma) => {
        // Kiểm tra phòng tồn tại
        const existingRoom = await prisma.room.findUnique({
          where: { id },
        });
        
        if (!existingRoom) {
          throw new Error(`Phòng với ID ${id} không tồn tại`);
        }
        
        // 1. Update the room basic information
        const room = await prisma.room.update({
          where: { id },
          data: {
            buildingId: updateRoomDto.buildingId,
            roomNumber: updateRoomDto.roomNumber,
            floor: updateRoomDto.floor,
            capacity: updateRoomDto.capacity,
            gender: updateRoomDto.gender,
            price: updateRoomDto.price,
            status: updateRoomDto.status,
          },
        });

        // 2. Update room amenities if provided
        if (updateRoomDto.amenities && updateRoomDto.amenities.length > 0) {
          // First delete existing amenities
          await prisma.roomAmenity.deleteMany({
            where: { roomId: id },
          });

          // Then create new amenities
          await Promise.all(
            updateRoomDto.amenities.map((amenity) =>
              prisma.roomAmenity.create({
                data: {
                  roomId: room.id,
                  amenityName: amenity.amenityName,
                  description: amenity.description,
                },
              })
            )
          );
        }

        // 3. Update room images if provided
        if (updateRoomDto.images && updateRoomDto.images.length > 0) {
          // Get existing images to potentially delete from Supabase
          const existingImages = await prisma.roomImage.findMany({
            where: { roomId: id },
          });

          // First delete existing images from database
          await prisma.roomImage.deleteMany({
            where: { roomId: id },
          });

          // Process each image - either upload to Supabase or use existing URL
          const imagePromises = updateRoomDto.images.map(async (image) => {
            let imageUrl = image.url;
            
            // If base64Data and filename are provided, upload to Supabase
            if (image.base64Data && image.filename) {
              // Generate a unique filename to avoid collisions
              const uniqueFilename = `${Date.now()}-${image.filename}`;
            }
            
            // Only create an image record if we have a URL
            if (imageUrl) {
              return prisma.roomImage.create({
                data: {
                  roomId: room.id,
                  url: imageUrl,
                  description: image.description,
                },
              });
            }
          });
          
          // Execute all valid image creation promises
          await Promise.all(imagePromises.filter(Boolean));
        }

        // 4. Return the updated room with its related amenities and images
        return prisma.room.findUnique({
          where: { id: room.id },
          include: {
            amenities: true,
            images: true,
          },
        });
      });
    } catch (error) {
      // Nếu có lỗi, tất cả thay đổi trong transaction đã được rollback tự động
      console.error('Error updating room:', error);
      throw new Error(`Không thể cập nhật phòng: ${error.message}`);
    }
  }

  async removeRoom(id: number) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        // First check if the room exists
        const room = await prisma.room.findUnique({
          where: { id },
          include: {
            images: true
          }
        });

        if (!room) {
          throw new Error(`Phòng với ID ${id} không tồn tại`);
        }
        // 1. Delete all related amenities
        await prisma.roomAmenity.deleteMany({
          where: { roomId: id },
        });

        // 2. Delete all related images from database
        await prisma.roomImage.deleteMany({
          where: { roomId: id },
        });

        // 3. Delete the room itself
        return prisma.room.delete({
          where: { id },
        });
      });
    } catch (error) {
      // Nếu có lỗi, tất cả thay đổi trong transaction đã được rollback tự động
      console.error('Error deleting room:', error);
      throw new Error(`Không thể xóa phòng: ${error.message}`);
    }
  }

}
