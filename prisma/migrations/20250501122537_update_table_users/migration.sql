/*
  Warnings:

  - A unique constraint covering the columns `[FacebookId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[GoogleId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `FacebookId` VARCHAR(255) NULL,
    ADD COLUMN `GoogleId` VARCHAR(255) NULL,
    ADD COLUMN `address` VARCHAR(255) NULL,
    ADD COLUMN `dateOfBirth` DATETIME(3) NULL,
    ADD COLUMN `isVerified` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `profileImage` VARCHAR(255) NULL,
    ADD COLUMN `status` BOOLEAN NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX `User_FacebookId_key` ON `User`(`FacebookId`);

-- CreateIndex
CREATE UNIQUE INDEX `User_GoogleId_key` ON `User`(`GoogleId`);
