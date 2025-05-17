-- AlterTable
ALTER TABLE `Post` ADD COLUMN `description` TEXT NULL,
    MODIFY `title` VARCHAR(255) NULL,
    MODIFY `content` TEXT NULL;
