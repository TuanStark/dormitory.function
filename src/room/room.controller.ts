import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { RoomService } from './room.service';
import { getPaginationParams } from 'src/common/utils/pagination.util';
import { Request } from 'express';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage , HttpStatus} from 'src/global/globalEnum';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}
  @Get()
  findAll(@Req() request: Request) {
    const paginationParams = getPaginationParams(request.query as Record<string, string>);
    return this.roomService.findAll(paginationParams);
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
    console.log(id);
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

  @Delete(':id')
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
