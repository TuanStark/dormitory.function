import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import * as querystring from 'querystring';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto) {
    if (!createPaymentDto.returnUrl || !createPaymentDto.amount || !createPaymentDto.orderInfo) {
      throw new BadRequestException('Thiếu các trường bắt buộc');
    }
    if (createPaymentDto.amount <= 0) {
      throw new BadRequestException('Số tiền phải lớn hơn 0');
    }

    const vnp_TmnCode = this.configService.get<string>('VNP_TMNCODE', '0PF2M7VA');
    const vnp_HashSecret = this.configService.get<string>('VNP_HASH_SECRET', 'QRT7BHZX6NK0I6X7CLUP82BMOLI2VJR2');
    const vnp_Url = this.configService.get<string>('VNP_URL', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html');

    const vnp_ReturnUrl = encodeURIComponent(createPaymentDto.returnUrl);

    const payment = await this.prisma.payment.create({
      data: {
        amount: createPaymentDto.amount,
        bookingId: createPaymentDto.bookingId || 0,
        paymentMethod: PaymentMethod.bank_transfer,
        paymentStatus: PaymentStatus.unpaid,
      },
    });

    const orderId = payment.id.toString();

    const date = new Date();
    const createDate = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`;

    const amount = Math.round(createPaymentDto.amount * 100);

    const vnp_Params: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: vnp_TmnCode,
      vnp_Locale: createPaymentDto.locale || 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: createPaymentDto.orderInfo,
      vnp_OrderType: createPaymentDto.orderType || 'other',
      vnp_Amount: amount,
      vnp_ReturnUrl: vnp_ReturnUrl,
      vnp_IpAddr: createPaymentDto.ipAddr || '127.0.0.1',
      vnp_CreateDate: createDate,
      vnp_BankCode: 'NCB',
    };

    console.log('Tham số trước khi ký:', vnp_Params);

    const sortedParams = Object.fromEntries(Object.entries(vnp_Params).sort());
    const signData = this.createSignData(sortedParams);
    console.log('Dữ liệu ký:', signData);

    const secureHash = crypto
      .createHmac('sha512', vnp_HashSecret)
      .update(Buffer.from(signData, 'utf8'))
      .digest('hex');
    console.log('Chữ ký tạo ra:', secureHash);

    vnp_Params.vnp_SecureHash = secureHash;

    const paymentUrl = `${vnp_Url}?${this.createQueryString(vnp_Params)}`;
    console.log('URL thanh toán:', paymentUrl);

    return {
      paymentUrl,
      paymentId: payment.id,
      orderId: orderId,
    };
  }

  async vnpayReturn(query: any) {
    const vnp_HashSecret = this.configService.get<string>('VNP_HASH_SECRET', 'QRT7BHZX6NK0I6X7CLUP82BMOLI2VJR2');
    
    if (!query.vnp_SecureHash) {
      return { RspCode: '97', Message: 'Thiếu chữ ký bảo mật' };
    }

    const secureHash = query.vnp_SecureHash;
    console.log('Query nhận được:', query);
    console.log('Chữ ký nhận được:', secureHash);

    const paramsToVerify = { ...query };
    delete paramsToVerify.vnp_SecureHash;
    delete paramsToVerify.vnp_SecureHashType;

    // Giải mã các giá trị trong query (ví dụ: thay thế + hoặc %20 thành dấu cách)
    const decodedParams: any = {};
    for (const key in paramsToVerify) {
      if (paramsToVerify[key] !== null && paramsToVerify[key] !== undefined && paramsToVerify[key] !== '') {
        decodedParams[key] = typeof paramsToVerify[key] === 'string'
          ? decodeURIComponent(paramsToVerify[key].replace(/\+/g, ' '))
          : paramsToVerify[key];
      }
    }

    const sortedParams = this.sortObject(decodedParams);
    const signData = this.createSignData(sortedParams);
    console.log('Dữ liệu ký để xác minh:', signData);

    const checkSum = crypto
      .createHmac('sha512', vnp_HashSecret)
      .update(Buffer.from(signData, 'utf8'))
      .digest('hex');
    console.log('Chữ ký tính toán:', checkSum);

    if (secureHash !== checkSum) {
      return { RspCode: '97', Message: 'Chữ ký không hợp lệ' };
    }

    const orderId = query.vnp_TxnRef;
    const rspCode = query.vnp_ResponseCode;

    try {
      const payment = await this.prisma.payment.findUnique({
        where: { id: Number(orderId) },
      });

      if (!payment) {
        return { RspCode: '01', Message: 'Không tìm thấy đơn hàng' };
      }

      if (rspCode === '00') {
        await this.prisma.payment.update({
          where: { id: Number(orderId) },
          data: { 
            paymentStatus: PaymentStatus.paid,
            updateAt: new Date(),
          },
        });
        return { RspCode: '00', Message: 'Thành công' };
      } else {
        await this.prisma.payment.update({
          where: { id: Number(orderId) },
          data: { 
            paymentStatus: PaymentStatus.unpaid,
            updateAt: new Date(),
          },
        });
        return { RspCode: rspCode, Message: 'Giao dịch thất bại' };
      }
    } catch (error) {
      console.error('Lỗi cập nhật thanh toán:', error);
      throw new InternalServerErrorException('Không thể xử lý kết quả thanh toán');
    }
  }

  async findAll() {
    return this.prisma.payment.findMany({
      include: {
        booking: true,
      },
    });
  }

  async findByBookingId(bookingId: number) {
    return this.prisma.payment.findMany({
      where: { bookingId },
      include: {
        booking: true,
      },
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.payment.findMany({
      where: {
        booking: {
          userId,
        },
      },
      include: {
        booking: true,
      },
    });
  }

  private sortObject(obj: any) {
    const sorted: any = {};
    const keys = Object.keys(obj).sort();
    for (const key of keys) {
      sorted[key] = obj[key];
    }
    return sorted;
  }

  private createSignData(obj: any) {
    return Object.keys(obj)
      .filter(key => obj[key] !== null && obj[key] !== undefined && obj[key] !== '')
      .map(key => `${key}=${obj[key]}`)
      .join('&');
  }

  private createQueryString(obj: any) {
    return Object.keys(obj)
      .filter(key => obj[key] !== null && obj[key] !== undefined && obj[key] !== '')
      .map(key => `${key}=${encodeURIComponent(obj[key])}`)
      .join('&');
  }
}