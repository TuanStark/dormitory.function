import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindAllUsersDto } from './dto/findall-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll(user : FindAllUsersDto){
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'id',
      sortOrder = 'asc', 
    } = user;
    // Validate page and limit to be positive integers
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    if (pageNumber < 1 || limitNumber < 1) {
      throw new Error('Page and limit must be greater than 0');
    };

    const take = limitNumber;
    const skip = (pageNumber - 1) * limitNumber;

    const where = search
      ? {
          OR: [
            { fullName: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: where,
        orderBy: {
          [sortBy]: sortOrder,},
        skip,
        take,
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
          roleId: true,
          gender: true,
          citizenId: true,
          universityId: true,
          profileImage: true,
          dateOfBirth: true,
          address: true,
          status: true,
          isVerified: true,
          createAt: true,
          updateAt: true,
        },
      }),
      this.prisma.user.count({
        where: where,
      }),
    ])
   return {
      data: users,
      meta: {
        total,
        pageNumber,
        limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

  async findOne(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async getCurrentUser(userId: number) {
    try {
      // Ensure userId is a valid integer
      if (!userId || isNaN(Number(userId)) || !Number.isInteger(Number(userId)) || Number(userId) <= 0) {
        throw new NotFoundException('Invalid user ID');
      }
      
      const user = await this.prisma.user.findUnique({
        where: { id: Number(userId) },
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
          roleId: true,
          gender: true,
          citizenId: true,
          universityId: true,
          profileImage: true,
          dateOfBirth: true,
          address: true,
          status: true,
          isVerified: true,
          createAt: true,
          updateAt: true,
          role: {
            select: {
              name: true
            }
          }
        }
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
      
      return user;
    } catch (error) {
      console.error('Error retrieving user:', error);
      // Re-throw the error to be handled by the controller
      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userId = Number(id);
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      })
      
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      
      // Try to handle date format if it's a string
      let updateData = { ...updateUserDto };
      
      // If dateOfBirth is provided and it's a string, convert it to proper ISO-8601 format with time
      if (updateData.dateOfBirth && typeof updateData.dateOfBirth === 'string') {
        try {
          // Ensure the date is in full ISO format with time component
          // If the date is just in YYYY-MM-DD format, add the time component
          const dateStr = updateData.dateOfBirth;
          if (dateStr.length === 10 && dateStr.includes('-')) {
            // If it's just a date without time (YYYY-MM-DD), add time
            updateData.dateOfBirth = `${dateStr}T00:00:00.000Z`;
          } else {
            // Try to parse and re-format to ensure valid ISO format
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) {
              throw new Error(`Invalid date format: ${dateStr}`);
            }
            updateData.dateOfBirth = date.toISOString();
          }
        } catch (e) {
          console.error('Error handling dateOfBirth:', e);
          throw new Error(`Invalid date format for dateOfBirth: ${updateData.dateOfBirth}`);
        }
      }
      
      
      try {
        const userUpdate = await this.prisma.user.update({
          where: { id: userId },
          data: updateData
        });
        return userUpdate;
      } catch (updateError) {
        console.error('Error in prisma update operation:', updateError);
        throw updateError;
      }
    } catch (error) {
      console.error('Full error:', error);
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      // Check if it's a Prisma error
      if (error.code) {
        console.error('Prisma error code:', error.code);
        
        if (error.code === 'P2025') {
          throw new NotFoundException(`User with ID ${userId} not found`);
        } else if (error.code === 'P2002') {
          throw new Error(`Unique constraint failed: ${error.meta?.target?.join(', ')}`);
        } else {
          throw new Error(`Database error: ${error.message}`);
        }
      }
      
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async remove(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: { 
        status: false,
        deletedAt: new Date()
      }
    });
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByfacebookId(facebookId: string) {
    const user = await this.prisma.user.findUnique({
      where: { FacebookId: facebookId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  
}
