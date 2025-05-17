export class BuildingResponseDto {
  id: number;
  name: string;
  address: string;
  image: string;
  description: string;
  averageRating: number;
  reviewCount: number;
  minPrice: number;
  maxPrice: number;
  capacity: {
    min: number;
    max: number;
  };
  amenities: {
    wifi: boolean;
    airConditioner: boolean;
    service24h: boolean;
    parking: boolean;
    internet: boolean;
    other: string[];
  };

  constructor(partial: Partial<BuildingResponseDto>) {
    Object.assign(this, partial);
  }
}
