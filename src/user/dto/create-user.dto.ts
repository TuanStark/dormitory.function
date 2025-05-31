import { IsEmail, IsOptional, IsString, IsEnum, IsNumber, IsBoolean, IsDateString } from "class-validator";
import { Gender } from "@prisma/client";

export class CreateUserDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsNumber()
  roleId?: number;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  citizenId?: string;

  @IsOptional()
  @IsNumber()
  universityId?: number;

  @IsOptional()
  @IsString()
  FacebookId?: string;

  @IsOptional()
  @IsString()
  GoogleId?: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}
