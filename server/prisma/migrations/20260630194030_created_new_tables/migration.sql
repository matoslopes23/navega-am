-- CreateEnum
CREATE TYPE "ConfidenceLevel" AS ENUM ('ALTO', 'MEDIO', 'BAIXO');

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "confidenceLevel" "ConfidenceLevel" NOT NULL DEFAULT 'BAIXO',
ALTER COLUMN "createdAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "RawLocation" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "pingedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RawLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoatLocation" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "confidenceLevel" "ConfidenceLevel" NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BoatLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RawLocation_tripId_idx" ON "RawLocation"("tripId");

-- CreateIndex
CREATE INDEX "RawLocation_pingedAt_idx" ON "RawLocation"("pingedAt");

-- CreateIndex
CREATE INDEX "BoatLocation_tripId_idx" ON "BoatLocation"("tripId");

-- AddForeignKey
ALTER TABLE "RawLocation" ADD CONSTRAINT "RawLocation_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoatLocation" ADD CONSTRAINT "BoatLocation_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
