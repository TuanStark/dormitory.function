-- AlterTable
ALTER TABLE `Building` MODIFY `name` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `Role` MODIFY `name` VARCHAR(100) NULL,
    MODIFY `status` BOOLEAN NULL DEFAULT true;

-- AlterTable
ALTER TABLE `Room` MODIFY `roomNumber` VARCHAR(20) NULL;

-- AlterTable
ALTER TABLE `RoomImage` MODIFY `url` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `University` MODIFY `code` VARCHAR(50) NULL,
    MODIFY `status` BOOLEAN NULL DEFAULT true;

-- AlterTable
ALTER TABLE `User` MODIFY `fullName` VARCHAR(100) NULL,
    MODIFY `phoneNumber` VARCHAR(15) NULL,
    MODIFY `citizenId` VARCHAR(12) NULL;
