import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';

export class ContactFormDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  // Add any other fields that you want to include in your form
  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  company?: string;
} 