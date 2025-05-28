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
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
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
    console.log(user);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user =  await this.prisma.user.findUnique({
        where: { id }
      })
      if(user){
        const userUpdate = await this.prisma.user.update({
          where: { id },
          data: updateUserDto
        })
        return userUpdate
      }
      return null
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async remove(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: { status: false }
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
