ALTER TABLE "User" ADD COLUMN "locationConsentAt" TIMESTAMP(3), ADD COLUMN "locationConsentRevokedAt" TIMESTAMP(3);
ALTER TABLE "Trip" ADD COLUMN "trackingLive" BOOLEAN NOT NULL DEFAULT false, ADD COLUMN "routeId" TEXT;
ALTER TABLE "RawLocation" ADD COLUMN "accepted" BOOLEAN NOT NULL DEFAULT true, ADD COLUMN "rejectionReason" TEXT;

CREATE TABLE "Port" ("id" TEXT NOT NULL, "name" TEXT NOT NULL, "city" TEXT NOT NULL, "latitude" DOUBLE PRECISION NOT NULL, "longitude" DOUBLE PRECISION NOT NULL, "radiusMeters" INTEGER NOT NULL DEFAULT 1000, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Port_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "Port_name_city_key" ON "Port"("name", "city");

CREATE TABLE "RiverRoute" ("id" TEXT NOT NULL, "name" TEXT NOT NULL, "originName" TEXT NOT NULL, "destinationName" TEXT NOT NULL, "geometry" JSONB NOT NULL, "distanceKm" DOUBLE PRECISION, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "RiverRoute_pkey" PRIMARY KEY ("id"));

CREATE TYPE "TimelineEventType" AS ENUM ('TRACKING_STARTED','TRACKING_STOPPED','STATUS_CHANGED','POSITION_UPDATED','PORT_APPROACH','REPORT_CONFIRMED');
CREATE TABLE "TripTimelineEvent" ("id" TEXT NOT NULL, "tripId" TEXT NOT NULL, "type" "TimelineEventType" NOT NULL, "title" TEXT NOT NULL, "metadata" JSONB, "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "TripTimelineEvent_pkey" PRIMARY KEY ("id"));
CREATE INDEX "TripTimelineEvent_tripId_occurredAt_idx" ON "TripTimelineEvent"("tripId", "occurredAt");

CREATE TABLE "NotificationDevice" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, "token" TEXT NOT NULL, "platform" TEXT NOT NULL, "active" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "NotificationDevice_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "NotificationDevice_token_key" ON "NotificationDevice"("token"); CREATE INDEX "NotificationDevice_userId_active_idx" ON "NotificationDevice"("userId","active");

CREATE TABLE "TripNotificationSubscription" ("id" TEXT NOT NULL, "tripId" TEXT NOT NULL, "userId" TEXT NOT NULL, "active" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "TripNotificationSubscription_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "TripNotificationSubscription_tripId_userId_key" ON "TripNotificationSubscription"("tripId","userId"); CREATE INDEX "TripNotificationSubscription_userId_active_idx" ON "TripNotificationSubscription"("userId","active");

CREATE TABLE "Notification" ("id" TEXT NOT NULL, "tripId" TEXT, "userId" TEXT NOT NULL, "type" TEXT NOT NULL, "title" TEXT NOT NULL, "body" TEXT NOT NULL, "data" JSONB, "readAt" TIMESTAMP(3), "sentAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Notification_pkey" PRIMARY KEY ("id"));
CREATE INDEX "Notification_userId_readAt_createdAt_idx" ON "Notification"("userId","readAt","createdAt"); CREATE INDEX "Notification_sentAt_createdAt_idx" ON "Notification"("sentAt","createdAt");

CREATE TABLE "AuditLog" ("id" TEXT NOT NULL, "userId" TEXT, "action" TEXT NOT NULL, "entity" TEXT NOT NULL, "entityId" TEXT, "metadata" JSONB, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id"));
CREATE INDEX "AuditLog_entity_entityId_createdAt_idx" ON "AuditLog"("entity","entityId","createdAt");

ALTER TABLE "Trip" ADD CONSTRAINT "Trip_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "RiverRoute"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TripTimelineEvent" ADD CONSTRAINT "TripTimelineEvent_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "NotificationDevice" ADD CONSTRAINT "NotificationDevice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TripNotificationSubscription" ADD CONSTRAINT "TripNotificationSubscription_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TripNotificationSubscription" ADD CONSTRAINT "TripNotificationSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
