/*
  Warnings:

  - You are about to drop the column `auditor` on the `Audit` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Audit` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Equipment` table. All the data in the column will be lost.
  - You are about to drop the column `likelihood` on the `RiskAssessment` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `RiskAssessment` table. All the data in the column will be lost.
  - You are about to drop the column `severity` on the `RiskAssessment` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Training` table. All the data in the column will be lost.
  - You are about to drop the column `instructor` on the `Training` table. All the data in the column will be lost.
  - Added the required column `auditorId` to the `Audit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Equipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assessorId` to the `RiskAssessment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `RiskAssessment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department` to the `RiskAssessment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `RiskAssessment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instructorId` to the `Training` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Risk" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hazard" TEXT NOT NULL,
    "description" TEXT,
    "likelihood" INTEGER NOT NULL,
    "severity" INTEGER NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "controls" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "dueDate" DATETIME,
    "assessmentId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Risk_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "RiskAssessment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Audit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "date" DATETIME NOT NULL,
    "auditorId" TEXT NOT NULL,
    "department" TEXT NOT NULL DEFAULT 'general',
    "findings" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Audit_auditorId_fkey" FOREIGN KEY ("auditorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Audit" ("createdAt", "date", "department", "description", "findings", "id", "status", "title", "updatedAt") SELECT "createdAt", "date", "department", "description", "findings", "id", "status", "title", "updatedAt" FROM "Audit";
DROP TABLE "Audit";
ALTER TABLE "new_Audit" RENAME TO "Audit";
CREATE TABLE "new_Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Document_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Document" ("category", "createdAt", "description", "fileUrl", "id", "status", "title", "updatedAt", "version") SELECT "category", "createdAt", "description", "fileUrl", "id", "status", "title", "updatedAt", "version" FROM "Document";
DROP TABLE "Document";
ALTER TABLE "new_Document" RENAME TO "Document";
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
    "createdById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Equipment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Equipment" ("createdAt", "department", "description", "id", "lastMaintenanceDate", "name", "nextMaintenanceDate", "purchaseDate", "serialNumber", "status", "updatedAt") SELECT "createdAt", "department", "description", "id", "lastMaintenanceDate", "name", "nextMaintenanceDate", "purchaseDate", "serialNumber", "status", "updatedAt" FROM "Equipment";
DROP TABLE "Equipment";
ALTER TABLE "new_Equipment" RENAME TO "Equipment";
CREATE TABLE "new_RiskAssessment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "department" TEXT NOT NULL,
    "assessorId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "nextAssessmentDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RiskAssessment_assessorId_fkey" FOREIGN KEY ("assessorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RiskAssessment" ("createdAt", "description", "id", "title", "updatedAt") SELECT "createdAt", "description", "id", "title", "updatedAt" FROM "RiskAssessment";
DROP TABLE "RiskAssessment";
ALTER TABLE "new_RiskAssessment" RENAME TO "RiskAssessment";
CREATE TABLE "new_Training" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "instructorId" TEXT NOT NULL,
    "attendees" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Training_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Training" ("attendees", "createdAt", "description", "endDate", "id", "startDate", "status", "title", "updatedAt") SELECT "attendees", "createdAt", "description", "endDate", "id", "startDate", "status", "title", "updatedAt" FROM "Training";
DROP TABLE "Training";
ALTER TABLE "new_Training" RENAME TO "Training";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
