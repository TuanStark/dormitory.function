/*
  Warnings:

  - You are about to drop the column `rating` on the `Review` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Review` DROP COLUMN `rating`,
    ADD COLUMN `averageRating` FLOAT NOT NULL DEFAULT 0,
    ADD COLUMN `fiveStar` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `fourStar` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `oneStar` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `threeStar` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `twoStar` INTEGER NOT NULL DEFAULT 0;
