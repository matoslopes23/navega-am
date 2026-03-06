/*
  Warnings:

  - Added the required column `latitude` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('em_transito', 'no_porto', 'programado');

-- CreateEnum
CREATE TYPE "ItineraryType" AS ENUM ('saida', 'escala', 'destino');

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "status" "TripStatus" NOT NULL DEFAULT 'programado';

-- CreateTable
CREATE TABLE "Itinerary" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ItineraryType" NOT NULL,
    "time" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Itinerary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Accommodation" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Accommodation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Itinerary_tripId_idx" ON "Itinerary"("tripId");

-- CreateIndex
CREATE INDEX "Itinerary_order_idx" ON "Itinerary"("order");

-- CreateIndex
CREATE INDEX "Accommodation_tripId_idx" ON "Accommodation"("tripId");

-- AddForeignKey
ALTER TABLE "Itinerary" ADD CONSTRAINT "Itinerary_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Accommodation" ADD CONSTRAINT "Accommodation_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
