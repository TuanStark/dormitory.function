/*
  Warnings:

  - You are about to drop the column `averageRating` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `fiveStar` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `fourStar` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `oneStar` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `threeStar` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `twoStar` on the `Review` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Building` ADD COLUMN `averageRating` FLOAT NOT NULL DEFAULT 0,
    ADD COLUMN `fiveStar` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `fourStar` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `oneStar` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `threeStar` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `twoStar` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Review` DROP COLUMN `averageRating`,
    DROP COLUMN `fiveStar`,
    DROP COLUMN `fourStar`,
    DROP COLUMN `oneStar`,
    DROP COLUMN `threeStar`,
    DROP COLUMN `twoStar`;
