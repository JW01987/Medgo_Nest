/*
  Warnings:

  - A unique constraint covering the columns `[EMAIL]` on the table `Member` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[LICENSE_CODE]` on the table `Member` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Pharmacy` will be added. If there are existing duplicate values, this will fail.
  - Made the column `PRODUCT_NAME` on table `Medicine` required. This step will fail if there are existing NULL values in that column.
  - Made the column `MANUFACTURER_NAME` on table `Medicine` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Medicine` MODIFY `PRODUCT_NAME` VARCHAR(191) NOT NULL,
    MODIFY `MANUFACTURER_NAME` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Member_EMAIL_key` ON `Member`(`EMAIL`);

-- CreateIndex
CREATE UNIQUE INDEX `Member_LICENSE_CODE_key` ON `Member`(`LICENSE_CODE`);

-- CreateIndex
CREATE UNIQUE INDEX `Pharmacy_userId_key` ON `Pharmacy`(`userId`);
