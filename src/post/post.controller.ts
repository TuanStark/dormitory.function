import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { Request } from 'express';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { getPaginationParams } from 'src/common/utils/pagination.util';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    try {
      return new ResponseData(
        await this.postService.create(createPostDto),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS
      );
    } catch (error) {
      return new ResponseData(
        error,
        HttpStatus.SERVER_ERROR,
        HttpMessage.SERVER_ERROR
      );
    }
  }

  @Get()
  findAll(@Req() request: Request) {
    const paginationParams = getPaginationParams(request.query as Record<string, string>);
    return this.postService.findAll(paginationParams);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return new ResponseData(
        await this.postService.findOne(+id),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS
      );
    } catch (error) {
      return new ResponseData(
        error,
        HttpStatus.SERVER_ERROR,
        HttpMessage.SERVER_ERROR
      );
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    try {
      return new ResponseData(
        await this.postService.update(+id, updatePostDto),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS
      );
    } catch (error) {
      return new ResponseData(
        error,
        HttpStatus.SERVER_ERROR,
        HttpMessage.SERVER_ERROR
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return new ResponseData(
        await this.postService.remove(+id),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS
      );
    } catch (error) {
      return new ResponseData(
        error,
        HttpStatus.SERVER_ERROR,
        HttpMessage.SERVER_ERROR
      );
    }
  }
}
