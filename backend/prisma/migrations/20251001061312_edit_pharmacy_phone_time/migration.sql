/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Pharmacy` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `PharmacyBoard` DROP FOREIGN KEY `PharmacyBoard_pharmacyId_fkey`;

-- DropForeignKey
ALTER TABLE `PharmacyStock` DROP FOREIGN KEY `PharmacyStock_pharmacyId_fkey`;

-- DropForeignKey
ALTER TABLE `StockHistory` DROP FOREIGN KEY `StockHistory_pharmacyId_fkey`;

-- DropIndex
DROP INDEX `PharmacyBoard_pharmacyId_fkey` ON `PharmacyBoard`;

-- DropIndex
DROP INDEX `PharmacyStock_pharmacyId_fkey` ON `PharmacyStock`;

-- DropIndex
DROP INDEX `StockHistory_pharmacyId_fkey` ON `StockHistory`;

-- AlterTable
ALTER TABLE `Member` DROP COLUMN `deletedAt`,
    ADD COLUMN `DELETED_AT` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Pharmacy` DROP COLUMN `deletedAt`,
    ADD COLUMN `DELETED_AT` DATETIME(3) NULL,
    MODIFY `PHONE` VARCHAR(191) NULL,
    MODIFY `OPEN_TIME` VARCHAR(191) NULL,
    MODIFY `CLOSE_TIME` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `PharmacyBoard` ADD COLUMN `DELETED_AT` DATETIME(3) NULL;

-- AddForeignKey
ALTER TABLE `PharmacyStock` ADD CONSTRAINT `PharmacyStock_pharmacyId_fkey` FOREIGN KEY (`pharmacyId`) REFERENCES `Pharmacy`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockHistory` ADD CONSTRAINT `StockHistory_pharmacyId_fkey` FOREIGN KEY (`pharmacyId`) REFERENCES `Pharmacy`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PharmacyBoard` ADD CONSTRAINT `PharmacyBoard_pharmacyId_fkey` FOREIGN KEY (`pharmacyId`) REFERENCES `Pharmacy`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
