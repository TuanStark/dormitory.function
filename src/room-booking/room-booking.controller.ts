import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { RoomBookingService } from './room-booking.service';
import { CreateRoomBookingDto } from './dto/create-room-booking.dto';
import { UpdateRoomBookingDto } from './dto/update-room-booking.dto';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { BookingStatus } from '@prisma/client';

@Controller('room-booking')
export class RoomBookingController {
  constructor(private readonly roomBookingService: RoomBookingService) {}

  @Post()
  async create(@Body() createRoomBookingDto: CreateRoomBookingDto) {
    try {
      const booking = await this.roomBookingService.create(createRoomBookingDto);
      return new ResponseData(
        booking,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS
      );
    } catch (error) {
      return new ResponseData(
        null,
        HttpStatus.SERVER_ERROR,
        error.message
      );
    }
  }

  @Get()
  async findAll(@Query('userId') userId?: string) {
    try {
      const bookings = await this.roomBookingService.findAll(
        userId ? parseInt(userId) : undefined
      );
      return new ResponseData(
        bookings,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS
      );
    } catch (error) {
      return new ResponseData(
        null,
        HttpStatus.SERVER_ERROR,
        error.message
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const booking = await this.roomBookingService.findOne(+id);
      return new ResponseData(
        booking,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS
      );
    } catch (error) {
      return new ResponseData(
        null,
        HttpStatus.SERVER_ERROR,
        error.message
      );
    }
  }

  @Post(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: BookingStatus
  ) {
    try {
      const booking = await this.roomBookingService.updateStatus(+id, status);
      return new ResponseData(
        booking,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS
      );
    } catch (error) {
      return new ResponseData(
        null,
        HttpStatus.SERVER_ERROR,
        error.message
      );
    }
  }
}
