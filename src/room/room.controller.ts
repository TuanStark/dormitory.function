import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { RoomService } from './room.service';
import { getPaginationParams } from 'src/common/utils/pagination.util';
import { Request } from 'express';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage , HttpStatus} from 'src/global/globalEnum';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}
  @Get()
  findAll(@Req() request: Request) {
    const paginationParams = getPaginationParams(request.query as Record<string, string>);
    return this.roomService.findAll(paginationParams);
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

}
