import { Injectable } from '@nestjs/common';
import { MailerService } from '../mailer/mailer.service';
import { ContactFormDto } from './dto/contact-form.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ContactService {
  private readonly adminEmail: string;

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    // Get admin email from config or use default
    this.adminEmail = this.configService.get('ADMIN_EMAIL', 'your-email@example.com');
  }

  /**
   * Submit contact form and send email notification
   * @param contactFormDto Form data from the contact form
   * @returns Result of the email sending operation
   */
  async submitContactForm(contactFormDto: ContactFormDto) {
    try {
      // console.log('Attempting to send email with data:', contactFormDto);
      // console.log('Admin email:', this.adminEmail);
      
      // Sending form data to admin email
      const result = await this.mailerService.sendFormData(
        this.adminEmail, 
        'New Contact Form Submission',
        contactFormDto,
      );

      console.log('Email sent successfully, result:', result);

      return {
        success: true,
        message: 'Form submitted successfully',
        ...result,
      };
    } catch (error) {
      // console.error('Error submitting contact form:', error);
      // Thêm chi tiết lỗi để dễ debug
      console.error('Error stack:', error.stack);
      throw new Error('Failed to submit form data. Please try again later.');
    }
  }
} 