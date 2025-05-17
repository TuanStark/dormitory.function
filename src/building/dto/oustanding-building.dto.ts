import { CreateRoomDto } from "src/room/dto/create-room.dto";

export class BuildingWithAverageRatingDto {
    id: number;
    name: string | null;
    image: string | null;
    description: string | null;
    latitude: number;
    address: string | null;
    longitude: number;
    floors: number;
    averageRating: number;
    rooms: CreateRoomDto[];
  
    constructor(building: any) {
      this.id = building.id;
      this.name = building.name;
      this.image = building.image;
      this.description = building.description;
      this.latitude = building.latitude;
      this.address = building.address;
      this.longitude = building.longitude;
      this.floors = building.floors;
      this.averageRating = building.averageRating ? parseFloat(building.averageRating.toFixed(2)) : 0;
      this.rooms = building.rooms || [];
    }
}