import { IsInt, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRoomAmenityDto {
  @IsInt()
  @IsNotEmpty()
  roomId: number;

  @IsString()
  @IsNotEmpty()
  amenityName: string;

  @IsString()
  @IsOptional()
  description?: string;
}
