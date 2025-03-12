import { z } from "zod";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Zod schemas for validation
export const AccidentSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.date(),
  time: z.string().optional(),
  location: z.string(),
  severity: z.string(),
  status: z.string(),
  reportedBy: z.string(),
  assignedTo: z.string().optional(),
  actions: z.array(z.string()).optional(),
  department: z.string().optional(),
  type: z.string().optional(),
  rootCause: z.string().optional(),
  immediateActions: z.string().optional(),
  createdBy: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const AccidentPersonnelSchema = z.object({
  id: z.string(),
  accidentId: z.string(),
  personnelId: z.string(),
  role: z.string(),
  injuries: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const AuditSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.date(),
  location: z.string(),
  type: z.string(),
  status: z.string(),
  auditor: z.string(),
  department: z.string().optional(),
  findings: z.array(z.string()).optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const AuditFindingSchema = z.object({
  id: z.string(),
  auditId: z.string(),
  title: z.string(),
  description: z.string(),
  severity: z.string(),
  status: z.string(),
  dueDate: z.date().optional(),
  assignedTo: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const IndicatorSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  unit: z.string(),
  target: z.number(),
  actual: z.number(),
  year: z.number(),
  month: z.number(),
  status: z.string(),
  createdBy: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

// Type exports
export type Accident = z.infer<typeof AccidentSchema>;
export type AccidentPersonnel = z.infer<typeof AccidentPersonnelSchema>;
export type Audit = z.infer<typeof AuditSchema>;
export type AuditFinding = z.infer<typeof AuditFindingSchema>;
export type Indicator = z.infer<typeof IndicatorSchema>;

// Drizzle table definitions
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(),
  department: text("department"),
  position: text("position"),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull()
});

export const accidents = sqliteTable("accidents", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  time: text("time"),
  location: text("location").notNull(),
  severity: text("severity").notNull(),
  status: text("status").notNull(),
  reportedBy: text("reportedBy").notNull(),
  assignedTo: text("assignedTo"),
  department: text("department"),
  type: text("type"),
  rootCause: text("rootCause"),
  immediateActions: text("immediateActions"),
  createdBy: text("createdBy"),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull()
});

export const accidentPersonnel = sqliteTable("accident_personnel", {
  id: text("id").primaryKey(),
  accidentId: text("accidentId").notNull().references(() => accidents.id),
  personnelId: text("personnelId").notNull(),
  role: text("role").notNull(),
  injuries: text("injuries"),
  notes: text("notes"),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull()
});

export const audits = sqliteTable("audits", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull(),
  auditor: text("auditor").notNull(),
  department: text("department"),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull()
});

export const auditFindings = sqliteTable("audit_findings", {
  id: text("id").primaryKey(),
  auditId: text("auditId").notNull().references(() => audits.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  severity: text("severity").notNull(),
  status: text("status").notNull(),
  dueDate: text("dueDate"),
  assignedTo: text("assignedTo"),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull()
});

export const indicators = sqliteTable("indicators", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  unit: text("unit").notNull(),
  target: integer("target").notNull(),
  actual: integer("actual").notNull(),
  year: integer("year").notNull(),
  month: integer("month").notNull(),
  status: text("status").notNull(),
  createdBy: text("createdBy").notNull().references(() => users.id),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull()
});

export const equipment = sqliteTable("equipment", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  location: text("location").notNull(),
  status: text("status").notNull(),
  lastMaintenance: text("lastMaintenance"),
  nextMaintenance: text("nextMaintenance"),
  notes: text("notes"),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull()
});

export const maintenanceLogs = sqliteTable("maintenance_logs", {
  id: text("id").primaryKey(),
  equipmentId: text("equipmentId").notNull().references(() => equipment.id),
  type: text("type").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  nextDate: text("nextDate"),
  status: text("status").notNull(),
  technician: text("technician").notNull(),
  notes: text("notes"),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull()
});

export const documents = sqliteTable("documents", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  status: text("status").notNull(),
  version: text("version").notNull(),
  createdBy: text("createdBy").notNull().references(() => users.id),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull()
});

export const reports = sqliteTable("reports", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull(),
  submittedBy: text("submittedBy").notNull().references(() => users.id),
  approvedBy: text("approvedBy").references(() => users.id),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull()
});

export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  priority: text("priority").notNull(),
  status: text("status").notNull(),
  dueDate: text("dueDate").notNull(),
  assignedTo: text("assignedTo").notNull().references(() => users.id),
  createdBy: text("createdBy").notNull().references(() => users.id),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull()
});

export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull(),
  userId: text("userId").notNull().references(() => users.id),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull()
});

export const personnel = sqliteTable("personnel", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  department: text("department").notNull(),
  position: text("position").notNull(),
  status: text("status").notNull(),
  startDate: text("startDate").notNull(),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull()
});

export const riskAssessments = sqliteTable("risk_assessments", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  department: text("department").notNull(),
  assessor: text("assessor").notNull(),
  status: text("status").notNull(),
  date: text("date").notNull(),
  nextAssessmentDate: text("nextAssessmentDate"),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull()
});

export const risks = sqliteTable("risks", {
  id: text("id").primaryKey(),
  assessmentId: text("assessmentId").notNull().references(() => riskAssessments.id),
  hazard: text("hazard").notNull(),
  description: text("description").notNull(),
  likelihood: integer("likelihood").notNull(),
  severity: integer("severity").notNull(),
  riskLevel: text("riskLevel").notNull(),
  controls: text("controls").notNull(),
  status: text("status").notNull(),
  dueDate: text("dueDate"),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull()
});

export const trainings = sqliteTable("trainings", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull(),
  startDate: text("startDate").notNull(),
  endDate: text("endDate").notNull(),
  instructor: text("instructor").notNull().references(() => users.id),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull()
});

export const trainingParticipants = sqliteTable("training_participants", {
  id: text("id").primaryKey(),
  trainingId: text("trainingId").notNull().references(() => trainings.id),
  userId: text("userId").notNull().references(() => users.id),
  status: text("status").notNull(),
  completedAt: text("completedAt")
});

export const checklists = sqliteTable("checklists", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(),
  department: text("department"),
  location: text("location"),
  status: text("status").notNull(),
  dueDate: text("dueDate").notNull(),
  assignedTo: text("assignedTo").notNull().references(() => users.id),
  createdBy: text("createdBy").notNull().references(() => users.id),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull()
});

export const checklistItems = sqliteTable("checklist_items", {
  id: text("id").primaryKey(),
  checklistId: text("checklistId").notNull().references(() => checklists.id),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull(),
  order: integer("order").notNull(),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull()
});

export const incidents = sqliteTable("incidents", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  location: text("location").notNull(),
  severity: text("severity").notNull(),
  status: text("status").notNull(),
  reportedBy: text("reportedBy").notNull(),
  assignedTo: text("assignedTo"),
  actions: text("actions"),
  followUps: text("followUps"),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull()
});

export const incidentActions = sqliteTable("incident_actions", {
  id: text("id").primaryKey(),
  incidentId: text("incidentId").notNull().references(() => incidents.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull(),
  dueDate: text("dueDate").notNull(),
  assignedTo: text("assignedTo").notNull().references(() => users.id),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull()
});

export const incidentFollowUps = sqliteTable("incident_follow_ups", {
  id: text("id").primaryKey(),
  incidentId: text("incidentId").notNull().references(() => incidents.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull(),
  date: text("date").notNull(),
  createdBy: text("createdBy").notNull().references(() => users.id),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull()
});
