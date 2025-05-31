import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { BuildingService } from './building.service';
import { CreateBuildingDto } from './dto/create-building.dto';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { BuildingWithAverageRatingDto } from './dto/oustanding-building.dto';
import { RoomGender } from '@prisma/client';
import { FindAllBuildingDto } from './dto/find-all-building.dto';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
@Controller('building')
export class BuildingController {
  constructor(private readonly buildingService: BuildingService) {}

  // @UseGuards(JwtAuthGuard)
  @Post()
  async createBuilding(@Body() data: CreateBuildingDto) {
    try {
      const building = await this.buildingService.createBuilding(data);
      return new ResponseData(building, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.SERVER_ERROR, HttpMessage.SERVER_ERROR);
    }
  }

  @Patch(':id')
  async updateBuilding(@Param('id') id: string, @Body() data: CreateBuildingDto) {
    try {
      const building = await this.buildingService.updateBuilding(+id, data);
      return new ResponseData(building, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.SERVER_ERROR, HttpMessage.SERVER_ERROR);
    }
  }

  @Patch('delete/:id')
  async deleteBuilding(@Param('id') id: string) {
    try {
      const building = await this.buildingService.deleteBuilding(+id);
      return new ResponseData(building, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.SERVER_ERROR, HttpMessage.SERVER_ERROR);
    }
  }

  @Get()
  async findAll(@Query() query: FindAllBuildingDto) {
    try {
      const result = await this.buildingService.findAll(query);
      return new ResponseData(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS
      );
    } catch (error) {
      console.error('Find all buildings error:', error);
      return new ResponseData(
        null,
        HttpStatus.SERVER_ERROR,
        HttpMessage.SERVER_ERROR
      );
    }
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

  @Get('search')
  async searchBuildings(
    @Query('search') search?: string,
    @Query('location') location?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('gender') gender?: RoomGender,
    @Query('amenities') amenities?: string,
    @Query('sortOption') sortOption: string = 'Mặc định',
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    try {
      // Xử lý các tham số tìm kiếm
      // Nếu không có điều kiện tìm kiếm nào được cung cấp, vẫn phải trả về tất cả các tòa nhà
      const hasSearchCriteria = search || location || minPrice || maxPrice || gender || amenities;
      
      const searchParams = {
        search,
        location,
        minPrice: minPrice ? parseInt(minPrice) : undefined,
        maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
        gender,
        amenities: amenities ? amenities.split(',') : [],
        // Đánh dấu rõ ràng nếu không có điều kiện tìm kiếm nào được cung cấp
        noFilterProvided: !hasSearchCriteria
      };

      const parsedPage = parseInt(page) || 1;
      const parsedLimit = parseInt(limit) || 10;

      const result = await this.buildingService.searchBuildings(
        searchParams,
        sortOption,
        parsedPage,
        parsedLimit
      );
      
      return new ResponseData(
        result,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS
      );
    } catch (error) {
      console.error('Search error:', error);
      return new ResponseData(
        null,
        HttpStatus.SERVER_ERROR,
        HttpMessage.SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async getBuildingRooms(
    @Param('id') id: string,
    @Query('limit') limit: string
  ) {
    try {
      // Convert limit to number if provided
      const parsedLimit = limit ? parseInt(limit) : undefined;
      const buildingRooms = await this.buildingService.getRoomsWithDetailsByBuildingId(+id, parsedLimit);
      
      if (!buildingRooms) {
        return new ResponseData(
          null,
          HttpStatus.NOT_FOUND,
          HttpMessage.NOT_FOUND
        );
      }
      
      return new ResponseData(  
        buildingRooms,
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
