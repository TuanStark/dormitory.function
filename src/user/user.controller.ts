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
