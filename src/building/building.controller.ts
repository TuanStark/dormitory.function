import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { getPaginationParams } from 'src/common/utils/pagination.util';
import { BuildingService } from './building.service';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { PaginationParams, paginate } from 'src/common/utils/pagination.util';
import { BuildingWithAverageRatingDto } from './dto/oustanding-building.dto';

@Controller('building')
export class BuildingController {
  constructor(private readonly buildingService: BuildingService) {}

  @Get()
  findAll(@Req() request: Request) {
    const paginationParams = getPaginationParams(request.query as Record<string, string>);
    return this.buildingService.findAll(paginationParams);
  }

  @Get('top-rated')
  async getBuildingsWithHighestAverageRating(
    @Query('limit') limit: string = '3',
  ): Promise<ResponseData<BuildingWithAverageRatingDto[]>> {
    try {
      const parsedLimit = Number(limit) || 3; 
      const buildings = await this.buildingService.getBuildingsWithHighestAverageRating(parsedLimit);
      return new ResponseData<BuildingWithAverageRatingDto[]>(
        buildings,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS
      );
    } catch (error) {
      return new ResponseData<BuildingWithAverageRatingDto[]>(
        [],
        HttpStatus.SERVER_ERROR,
        HttpMessage.SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const building = await this.buildingService.findOne(+id);
      
      if (!building) {
        return new ResponseData(
          null,
          HttpStatus.NOT_FOUND,
          HttpMessage.NOT_FOUND
        );
      }
      
      return new ResponseData(  
        building,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS
      );
    } catch (error) {
      return new ResponseData(
        null,
        HttpStatus.SERVER_ERROR,
        HttpMessage.SERVER_ERROR
      );
    }
  }

}
