import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerService } from './mailer.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        // console.log('Mail template path:', process.cwd() + '/src/mail/templates/');
        return {
          transport: {
            host: configService.get('MAIL_HOST', 'smtp.gmail.com'),
            port: 465,
            secure: true,
            auth: {
              user: configService.get('MAIL_USER'),
              pass: configService.get('MAIL_PASSWORD', configService.get('MAIL_PASS')),
            },
          },
          defaults: {
            from: `"Dormitory System" <${configService.get('MAIL_USER')}>`,
          },
          template: {
            dir: process.cwd() + '/src/mail/templates/',
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerConfigModule {} 