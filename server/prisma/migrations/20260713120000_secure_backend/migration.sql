-- Preserve the original creation timestamp and add authorization roles.
ALTER TABLE "Trip" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');
ALTER TABLE "User" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'USER';
