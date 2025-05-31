import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailerService {
  constructor(private mailerService: NestMailerService) {}

  /**
   * Send form data to recipient email using template
   * @param to Recipient email address
   * @param subject Email subject
   * @param formData Object containing form data
   * @returns Promise with send mail result
   */
  async sendFormData(to: string, subject: string, formData: any): Promise<any> {
    try {
      // console.log('Sending email to:', to);
      // console.log('Using template: contact-feedback');
      
      // Gửi email thông báo cho admin
      const result = await this.mailerService.sendMail({
        to,
        subject,
        template: 'contact-feedback',
        context: {
          ...formData,
          year: new Date().getFullYear(),
        },
      });

      // console.log('Admin notification email sent successfully:', result.messageId);

      // Gửi email phản hồi tự động cho người gửi form
      if (formData.email) {
        // console.log('Sending auto-reply to:', formData.email);
        
        const autoReplyResult = await this.mailerService.sendMail({
          to: formData.email,
          subject: 'Cảm ơn bạn đã liên hệ với chúng tôi',
          template: 'auto-reply',
          context: {
            ...formData,
            year: new Date().getFullYear(),
          },
        });
        
        // console.log('Auto-reply email sent successfully:', autoReplyResult.messageId);
      }

      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error) {
      console.error('Error details in mailer service:', error);
      console.error('Stack trace:', error.stack);
      throw error;
    }
  }
} 