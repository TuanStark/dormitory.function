import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { BuildingModule } from './building/building.module';
import { RoomModule } from './room/room.module';
import { PostModule } from './post/post.module';
import { RoomAmenityModule } from './room-amenity/room-amenity.module';
import { RoomImagesModule } from './room-images/room-images.module';
import { ReviewModule } from './review/review.module';
import { RoomBookingModule } from './room-booking/room-booking.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    BuildingModule,
    RoomModule,
    PostModule,
    RoomAmenityModule,
    RoomImagesModule,
    ReviewModule,
    RoomBookingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
