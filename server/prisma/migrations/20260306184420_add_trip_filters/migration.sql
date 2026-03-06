-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "boatName" TEXT NOT NULL,
    "boatType" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "departureDate" TIMESTAMP(3) NOT NULL,
    "departureTime" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Trip_origin_destination_idx" ON "Trip"("origin", "destination");

-- CreateIndex
CREATE INDEX "Trip_departureDate_idx" ON "Trip"("departureDate");
