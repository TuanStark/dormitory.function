import { IsEmail } from "class-validator";

import { IsNotEmpty } from "class-validator";

import { IsString } from "class-validator";

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  citizenId: string;

  @IsString()
  address: string;
}
