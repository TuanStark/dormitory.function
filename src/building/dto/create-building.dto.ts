import { Room } from "src/room/entities/room.entity";

export class CreateBuildingDto {
    name: string;
    image: string;
    description: string;
    latitude: number;
    address: string;
    longitude: number;
    floors: number;
    averageRating: number;
    fiveStar: number;
    fourStar: number;
    threeStar: number;
    twoStar: number;
    oneStar: number;
    createAt: Date;
    updateAt: Date;
}
