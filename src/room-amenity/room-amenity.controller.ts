import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { RoomAmenityService } from './room-amenity.service';
import { CreateRoomAmenityDto } from './dto/create-room-amenity.dto';
import { UpdateRoomAmenityDto } from './dto/update-room-amenity.dto';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';

@Controller('room-amenity')
export class RoomAmenityController {
  constructor(private readonly roomAmenityService: RoomAmenityService) {}

  @Post()
  async create(@Body() createRoomAmenityDto: CreateRoomAmenityDto) {
    try {
      return new ResponseData(await this.roomAmenityService.create(createRoomAmenityDto), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(null, HttpStatus.SERVER_ERROR, HttpMessage.SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return new ResponseData(await this.roomAmenityService.findOne(+id), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(null, HttpStatus.SERVER_ERROR, HttpMessage.SERVER_ERROR);
    }
  }

  @Get('room/:roomId')
  async findByRoomId(@Param('roomId') roomId: string) {
    try {
      return new ResponseData(await this.roomAmenityService.findByRoomId(+roomId), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(null, HttpStatus.SERVER_ERROR, HttpMessage.SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoomAmenityDto: UpdateRoomAmenityDto) {
    try {
      return new ResponseData(await this.roomAmenityService.update(+id, updateRoomAmenityDto), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(null, HttpStatus.SERVER_ERROR, HttpMessage.SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return new ResponseData(await this.roomAmenityService.remove(+id), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(null, HttpStatus.SERVER_ERROR, HttpMessage.SERVER_ERROR);
    }
  }
}
