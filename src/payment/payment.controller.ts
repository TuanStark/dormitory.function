import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-payment')
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.createPayment(createPaymentDto);
  }

  @Get('vnpay-return')
  async vnpayReturn(@Query() query: any) {
    return this.paymentService.vnpayReturn(query);
  }

  @Get()
  async findAll() {
    return this.paymentService.findAll();
  }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   return this.paymentService.findOne(+id);
  // }

  @Get('booking/:bookingId')
  async findByBookingId(@Param('bookingId') bookingId: string) {
    return this.paymentService.findByBookingId(+bookingId);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    return this.paymentService.findByUserId(+userId);
  }
} 