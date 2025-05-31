import { Controller, Get, Param, Patch, Body, UseGuards, Query, Delete } from '@nestjs/common';
import { User } from '@prisma/client';
//import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { GetUser } from '../auth/decorator';
import { MyJwtGuard } from '../auth/guard';
import { UserService } from './user.service';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUsersDto } from './dto/findall-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  //path : .../users/me
  //@UseGuards(AuthGuard('jwt'))
  
  @UseGuards(MyJwtGuard)
  @Get('me')
  async getCurrentUser(@GetUser('sub') userId: number, @GetUser() user: any) {
    try {
      // If userId is not provided via the 'sub' property, try to get it from the user object
      if (!userId && user && user.id) {
        userId = Number(user.id);
        console.log('Using user.id instead of sub:', userId);
      }
      
      // If we still don't have a valid userId, throw an error
      if (!userId) {
        console.error('No valid userId found in request', { user });
        return new ResponseData(
          null,
          HttpStatus.BAD_REQUEST,
          'User ID not found in request'
        );
      }
      
      const userData = await this.userService.getCurrentUser(userId);
      return new ResponseData(
        userData,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS
      );
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      // Check for specific error types
      if (error.name === 'PrismaClientValidationError') {
        return new ResponseData(
          null,
          HttpStatus.BAD_REQUEST,
          'Invalid data format: ' + error.message
        );
      } else if (error.name === 'NotFoundException') {
        return new ResponseData(
          null,
          HttpStatus.NOT_FOUND,
          error.message
        );
      } else {
        return new ResponseData(
          null,
          HttpStatus.SERVER_ERROR,
          'An error occurred while retrieving user data'
        );
      }
    }
  }
  
  @UseGuards(MyJwtGuard) //you can also make your own "decorator"
  @Get(':id')
  async me(@Param('id') id: string) {
    try {
      return new ResponseData(
        await this.userService.findOne(+id),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS
      );
    } catch (error) {
      return new ResponseData(
        error,
        HttpStatus.SERVER_ERROR,
        HttpMessage.SERVER_ERROR
      );
    }
  }

  @UseGuards(MyJwtGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      return new ResponseData(
        await this.userService.update(+id, updateUserDto),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS
      );
    } catch (error) {
      return new ResponseData(
        error,
        HttpStatus.SERVER_ERROR,
        HttpMessage.SERVER_ERROR
      );
    }
  }

  @UseGuards(MyJwtGuard)
  @Get('google/:email')
  async findOneByEmail(@Param('email') email: string) {
    try {
      return new ResponseData(  
        await this.userService.findByEmail(email),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS
      );
    } catch (error) {
      return new ResponseData(
        error,
        HttpStatus.SERVER_ERROR,
        HttpMessage.SERVER_ERROR
      );
    }
  }

  @UseGuards(MyJwtGuard)
  @Get('facebook/:facebookId')
  async findByFacebookId(@Param('facebookId') facebookId: string) {
    try {
      return new ResponseData(
        await this.userService.findByfacebookId(facebookId),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS
      );
    } catch (error) {
      return new ResponseData(
        error,
        HttpStatus.SERVER_ERROR,
        HttpMessage.SERVER_ERROR
      );
    }
  }

  //@UseGuards(MyJwtGuard)
   @Get()
  async findAll(@Query() findAllDto: FindAllUsersDto): Promise<ResponseData<any>> {
    try {
      const result = await this.userService.findAll(findAllDto);
      return new ResponseData(
        result,
        HttpStatus.SUCCESS,
        'Successfully retrieved users',
      );
    } catch (error) {
      return new ResponseData(
        null,
        HttpStatus.SERVER_ERROR,
        error.message || 'An error occurred while retrieving users',
      );
    }
  }

  // @UseGuards(MyJwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
