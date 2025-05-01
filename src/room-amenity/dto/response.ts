export class RoomAmenityResponseDto {
    id: number;
    roomId: number;
    amenityName: string;
    description?: string;
    createAt: Date;
    updateAt: Date;
  
    constructor(roomAmenity: any) {
      this.id = roomAmenity.id;
      this.roomId = roomAmenity.roomId;
      this.amenityName = roomAmenity.amenityName;
      this.description = roomAmenity.description;
      this.createAt = roomAmenity.createAt;
      this.updateAt = roomAmenity.updateAt;
    }
  }