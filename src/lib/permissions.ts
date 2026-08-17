import type { Role } from "./types";

export type ModuleKey =
  | "dashboard"
  | "patients"
  | "reception"
  | "appointments"
  | "billing"
  | "consultation"
  | "laboratory"
  | "pharmacy"
  | "inpatient"
  | "reports"
  | "notifications"
  | "users"
  | "departments"
  | "services"
  | "audit"
  | "settings";

const ALL: ModuleKey[] = [
  "dashboard",
  "patients",
  "reception",
  "appointments",
  "billing",
  "consultation",
  "laboratory",
  "pharmacy",
  "inpatient",
  "reports",
  "notifications",
  "users",
  "departments",
  "services",
  "audit",
  "settings",
];

export const MODULE_ACCESS: Record<Role, ModuleKey[]> = {
  SUPER_ADMIN: ALL,
  HOSPITAL_ADMIN: ALL.filter((m) => m !== "audit").concat("audit"),
  RECEPTIONIST: ["dashboard", "patients", "reception", "appointments", "notifications"],
  BILLING_OFFICER: ["dashboard", "patients", "billing", "reports", "notifications"],
  DOCTOR: [
    "dashboard",
    "patients",
    "appointments",
    "consultation",
    "laboratory",
    "inpatient",
    "notifications",
  ],
  NURSE: ["dashboard", "patients", "consultation", "inpatient", "notifications"],
  LAB_TECHNICIAN: ["dashboard", "patients", "laboratory", "notifications"],
  PHARMACIST: ["dashboard", "patients", "pharmacy", "notifications"],
  INPATIENT_STAFF: ["dashboard", "patients", "inpatient", "notifications"],
};

export function canAccess(role: Role | undefined, module: ModuleKey): boolean {
  if (!role) return false;
  return MODULE_ACCESS[role]?.includes(module) ?? false;
}

export function isAdmin(role: Role | undefined): boolean {
  return role === "SUPER_ADMIN" || role === "HOSPITAL_ADMIN";
}
