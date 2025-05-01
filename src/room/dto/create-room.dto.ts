export class CreateRoomDto {
    // Room basic information
    buildingId: number;
    roomNumber: string;
    floor: number;
    capacity: number;
    gender: 'Male' | 'Female' | 'Mixed';
    price: number;
    status: 'available' | 'full' | 'under_maintenance';
    
    // For creating amenities
    amenities: {
        amenityName: string;
        description?: string;
    }[];
    
    // For creating images - now supporting base64 images
    images: {
        base64Data?: string;     // Base64 encoded image data
        filename?: string;       // Filename for the uploaded image
        url?: string;           // Direct URL if not uploading
        description?: string;
    }[];
}
