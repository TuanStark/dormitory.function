import { IsNotEmpty, IsString, IsEnum } from "class-validator";
import { PostStatus } from "@prisma/client";

export class CreatePostDto {
    userId: number;  

    @IsString()
    @IsNotEmpty()
    title: string;  

    @IsString()
    @IsNotEmpty()
    content: string; 

    @IsString()
    @IsNotEmpty()
    image?: string;   

    postedAt: Date; 

    @IsEnum(PostStatus)
    @IsNotEmpty()
    status: PostStatus;

    createAt: Date; 
    updateAt: Date; 
}
