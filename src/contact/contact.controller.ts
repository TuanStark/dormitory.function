import { Controller, Post, Body, HttpStatus as NestHttpStatus } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactFormDto } from './dto/contact-form.dto';
import { ResponseData } from 'src/global/globalClass';
import { HttpStatus, HttpMessage } from 'src/global/globalEnum';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  
  @Post('submit')
  async submitForm(@Body() contactFormDto: ContactFormDto) {
    try {
      const result = await this.contactService.submitContactForm(contactFormDto);
      
      return new ResponseData(
        result,
        HttpStatus.SUCCESS,
        'Form submitted successfully'
      );
    } catch (error) {
      // console.error('Error in contact form submission:', error);
      
      return new ResponseData(
        null,
        HttpStatus.SERVER_ERROR,
        error.message || 'Failed to submit form'
      );
    }
  }
} 