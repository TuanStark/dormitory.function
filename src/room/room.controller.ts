import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { RoomService } from './room.service';
import { getPaginationParams } from 'src/common/utils/pagination.util';
import { Request } from 'express';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage , HttpStatus} from 'src/global/globalEnum';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { MyJwtGuard } from '../auth/guard';
import { UseGuards } from '@nestjs/common';
import { FindAllDto } from './dto/findall-room.dto';
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  //@UseGuards(MyJwtGuard)
  @Get()
  async findAll(@Query() query: FindAllDto) {
    try {
      return new ResponseData(
        await this.roomService.findAll(query),
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

  @Post()
  async create(@Body() createRoomDto: CreateRoomDto) {
    try {
      return new ResponseData(
        await this.roomService.createRoom(createRoomDto),
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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return new ResponseData(  
        await this.roomService.findOne(+id),
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

  @Get('building/:id')
  async findRoomsByBuildingId(@Param('id') id: string, @Query('limit') limit?: string) {
    try {
      const buildingId = parseInt(id, 10);
      if (isNaN(buildingId)) {
        return new ResponseData(
          null,
          HttpStatus.BAD_REQUEST,
          'Building ID phải là số'
        );
      }
      
      const limitValue = limit ? parseInt(limit, 10) : undefined;
      
      return new ResponseData(
        await this.roomService.findRoomsByBuildingId(buildingId, limitValue),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS
      );
    } catch (error) {
      console.error('Controller error:', error);
      return new ResponseData(
        { message: error.message },
        HttpStatus.SERVER_ERROR,
        HttpMessage.SERVER_ERROR
      );
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    try {
      return new ResponseData(
        await this.roomService.updateRoom(+id, updateRoomDto),
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

  @Patch('delete/:id')
  async remove(@Param('id') id: string) {
    try {
      return new ResponseData(
        await this.roomService.removeRoom(+id),
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
}
