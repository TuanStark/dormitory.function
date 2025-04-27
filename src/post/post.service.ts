import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { paginate, PaginationParams } from 'src/common/utils/pagination.util';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createPostDto: CreatePostDto) {
    return await this.prisma.post.create({
      data: createPostDto
    });
  }

  async findAll(params: PaginationParams) {
    const searchFields = ['title', 'content'];
    return paginate(
      this.prisma,
      'post',
      params,
      searchFields
    );
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id }
    });
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.prisma.post.update({
      where: { id },
      data: updatePostDto
    });
    return post;
  }

  async remove(id: number) {
    const post = await this.prisma.post.delete({
      where: { id }
    });
    return post;
  }
}
