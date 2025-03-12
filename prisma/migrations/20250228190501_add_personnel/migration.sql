-- CreateTable
CREATE TABLE "Personnel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "safetyTrainingStatus" TEXT NOT NULL,
    "lastTrainingDate" DATETIME NOT NULL,
    "nextTrainingDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Personnel_employeeId_key" ON "Personnel"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "Personnel_email_key" ON "Personnel"("email");
