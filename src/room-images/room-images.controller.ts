import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomImagesService } from './room-images.service';
import { CreateRoomImageDto } from './dto/create-room-image.dto';
import { UpdateRoomImageDto } from './dto/update-room-image.dto';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';

@Controller('room-images')
export class RoomImagesController {
  constructor(private readonly roomImagesService: RoomImagesService) {}

  @Post()
  async create(@Body() createRoomImageDto: CreateRoomImageDto) {
    try {
      return new ResponseData(await this.roomImagesService.create(createRoomImageDto), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(null, HttpStatus.SERVER_ERROR, HttpMessage.SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return new ResponseData(await this.roomImagesService.findOne(+id), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(null, HttpStatus.SERVER_ERROR, HttpMessage.SERVER_ERROR);
    }
  }

  @Get('room/:roomId')
  async findByRoomId(@Param('roomId') roomId: string) {
    try {
      return new ResponseData(await this.roomImagesService.findByRoomId(+roomId), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(null, HttpStatus.SERVER_ERROR, HttpMessage.SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoomImageDto: UpdateRoomImageDto) {
    try {
      return new ResponseData(await this.roomImagesService.update(+id, updateRoomImageDto), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(null, HttpStatus.SERVER_ERROR, HttpMessage.SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return new ResponseData(await this.roomImagesService.remove(+id), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(null, HttpStatus.SERVER_ERROR, HttpMessage.SERVER_ERROR);
    }
  }
}
