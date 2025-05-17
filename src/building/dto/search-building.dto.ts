import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { RoomGender } from '@prisma/client';

export class SearchBuildingDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxPrice?: number;

  @IsOptional()
  @IsEnum(RoomGender)
  gender?: RoomGender;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  minCapacity?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  maxCapacity?: number;
}
