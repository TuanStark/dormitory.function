import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto, CreateBankTransferDto } from './dto/create-payment.dto';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-payment')
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.createPayment(createPaymentDto);
  }

  @Post('bank-transfer')
  async createBankTransfer(@Body() createBankTransferDto: CreateBankTransferDto) {
    try {
      const result = await this.paymentService.createBankTransfer(createBankTransferDto);
      return new ResponseData(
        result,
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

  @Post('bank-transfer/confirm/:id')
  async confirmBankTransfer(
    @Param('id') id: string,
    @Body('transactionCode') transactionCode?: string
  ) {
    try {
      const result = await this.paymentService.confirmBankTransfer(+id, transactionCode);
      return new ResponseData(
        result,
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