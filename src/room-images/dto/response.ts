export class RoomImageResponseDto {
    id: number;
    roomId: number;
    url?: string;
    description?: string;
    uploadedAt: Date;
    createAt: Date;
    updateAt: Date;
  
    constructor(roomImage: any) {
      this.id = roomImage.id;
      this.roomId = roomImage.roomId;
      this.url = roomImage.url;
      this.description = roomImage.description;
      this.uploadedAt = roomImage.uploadedAt;
      this.createAt = roomImage.createAt;
      this.updateAt = roomImage.updateAt;
    }
}