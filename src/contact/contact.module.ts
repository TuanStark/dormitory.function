import { Module } from '@nestjs/common';
import { MailerConfigModule } from '../mailer/mailer.module';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';

@Module({
  imports: [MailerConfigModule],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {} 