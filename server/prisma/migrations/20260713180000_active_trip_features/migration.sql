ALTER TABLE "Trip"
ADD COLUMN "lastPositionAt" TIMESTAMP(3),
ADD COLUMN "originLatitude" DOUBLE PRECISION,
ADD COLUMN "originLongitude" DOUBLE PRECISION,
ADD COLUMN "destinationLatitude" DOUBLE PRECISION,
ADD COLUMN "destinationLongitude" DOUBLE PRECISION;

ALTER TYPE "TripStatus" ADD VALUE IF NOT EXISTS 'embarcando';
ALTER TYPE "TripStatus" ADD VALUE IF NOT EXISTS 'concluido';
ALTER TYPE "TripStatus" ADD VALUE IF NOT EXISTS 'cancelado';
ALTER TYPE "TripStatus" ADD VALUE IF NOT EXISTS 'atrasado';

ALTER TABLE "RawLocation"
ADD COLUMN "clientPointId" TEXT,
ADD COLUMN "accuracy" DOUBLE PRECISION,
ADD COLUMN "speed" DOUBLE PRECISION,
ADD COLUMN "heading" DOUBLE PRECISION;

ALTER TABLE "BoatLocation"
ADD COLUMN "contributorCount" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN "speedKmh" DOUBLE PRECISION,
ADD COLUMN "progressPercent" DOUBLE PRECISION,
ADD COLUMN "remainingDistanceKm" DOUBLE PRECISION,
ADD COLUMN "estimatedArrival" TIMESTAMP(3);

CREATE UNIQUE INDEX "RawLocation_tripId_deviceId_clientPointId_key"
ON "RawLocation"("tripId", "deviceId", "clientPointId");

CREATE TYPE "TripReportType" AS ENUM ('DELAY', 'STOPPED', 'BREAKDOWN', 'SAFETY', 'MANUAL_POSITION', 'OTHER');
CREATE TYPE "TripReportStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED');

CREATE TABLE "TrackingParticipant" (
  "id" TEXT NOT NULL,
  "tripId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "stoppedAt" TIMESTAMP(3),
  CONSTRAINT "TrackingParticipant_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TripReport" (
  "id" TEXT NOT NULL,
  "tripId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" "TripReportType" NOT NULL,
  "description" TEXT,
  "latitude" DOUBLE PRECISION,
  "longitude" DOUBLE PRECISION,
  "status" "TripReportStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TripReport_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TrackingParticipant_tripId_userId_key" ON "TrackingParticipant"("tripId", "userId");
CREATE INDEX "TrackingParticipant_tripId_active_lastSeenAt_idx" ON "TrackingParticipant"("tripId", "active", "lastSeenAt");
CREATE INDEX "TripReport_tripId_status_createdAt_idx" ON "TripReport"("tripId", "status", "createdAt");

ALTER TABLE "TrackingParticipant" ADD CONSTRAINT "TrackingParticipant_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TrackingParticipant" ADD CONSTRAINT "TrackingParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TripReport" ADD CONSTRAINT "TripReport_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TripReport" ADD CONSTRAINT "TripReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
