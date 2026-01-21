-- CreateTable
CREATE TABLE "Track" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "album" TEXT NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "genre" TEXT NOT NULL,
    "coverUrl" TEXT
);

-- CreateTable
CREATE TABLE "PlaylistTrack" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trackId" TEXT NOT NULL,
    "position" REAL NOT NULL,
    "votes" INTEGER NOT NULL DEFAULT 0,
    "addedBy" TEXT NOT NULL,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPlaying" BOOLEAN NOT NULL DEFAULT false,
    "playedAt" DATETIME,
    CONSTRAINT "PlaylistTrack_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "PlaylistTrack_position_idx" ON "PlaylistTrack"("position");
