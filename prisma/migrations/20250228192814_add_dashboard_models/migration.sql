/*
  Warnings:

  - You are about to drop the column `location` on the `Equipment` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Equipment` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `capacity` on the `Training` table. All the data in the column will be lost.
  - You are about to drop the column `participants` on the `Training` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Audit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "date" DATETIME NOT NULL,
    "auditor" TEXT NOT NULL DEFAULT 'unassigned',
    "department" TEXT NOT NULL DEFAULT 'general',
    "findings" TEXT,
    "createdBy" TEXT NOT NULL DEFAULT 'system',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Audit" ("createdAt", "date", "description", "findings", "id", "status", "title", "updatedAt") SELECT "createdAt", "date", "description", "findings", "id", "status", "title", "updatedAt" FROM "Audit";
DROP TABLE "Audit";
ALTER TABLE "new_Audit" RENAME TO "Audit";
CREATE TABLE "new_Equipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "serialNumber" TEXT,
    "purchaseDate" DATETIME,
    "lastMaintenanceDate" DATETIME,
    "nextMaintenanceDate" DATETIME,
    "department" TEXT NOT NULL DEFAULT 'general',
    "createdBy" TEXT NOT NULL DEFAULT 'system',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Equipment" ("createdAt", "id", "lastMaintenanceDate", "name", "nextMaintenanceDate", "serialNumber", "status", "updatedAt") SELECT "createdAt", "id", "lastMaintenanceDate", "name", "nextMaintenanceDate", "serialNumber", "status", "updatedAt" FROM "Equipment";
DROP TABLE "Equipment";
ALTER TABLE "new_Equipment" RENAME TO "Equipment";
CREATE TABLE "new_Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'TODO',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "dueDate" DATETIME NOT NULL,
    "assignedTo" TEXT NOT NULL DEFAULT 'unassigned',
    "createdBy" TEXT NOT NULL DEFAULT 'system',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Task" ("assignedTo", "createdAt", "createdBy", "description", "dueDate", "id", "priority", "status", "title", "updatedAt") SELECT "assignedTo", "createdAt", "createdBy", "description", "dueDate", "id", "priority", "status", "title", "updatedAt" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE TABLE "new_Training" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "instructor" TEXT NOT NULL DEFAULT 'unassigned',
    "attendees" TEXT NOT NULL DEFAULT '[]',
    "createdBy" TEXT NOT NULL DEFAULT 'system',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Training" ("createdAt", "description", "endDate", "id", "instructor", "startDate", "status", "title", "updatedAt") SELECT "createdAt", "description", "endDate", "id", "instructor", "startDate", "status", "title", "updatedAt" FROM "Training";
DROP TABLE "Training";
ALTER TABLE "new_Training" RENAME TO "Training";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
