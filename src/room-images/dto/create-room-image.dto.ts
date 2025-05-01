import { IsInt, IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateRoomImageDto {
  @IsInt()
  @IsNotEmpty()
  roomId: number;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsString()
  @IsOptional()
  description?: string;
}
