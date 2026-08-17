import type { Timestamp } from "firebase/firestore";

export const ROLES = [
  "SUPER_ADMIN",
  "HOSPITAL_ADMIN",
  "RECEPTIONIST",
  "BILLING_OFFICER",
  "DOCTOR",
  "NURSE",
  "LAB_TECHNICIAN",
  "PHARMACIST",
  "INPATIENT_STAFF",
] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  HOSPITAL_ADMIN: "Hospital Admin",
  RECEPTIONIST: "Receptionist",
  BILLING_OFFICER: "Billing Officer",
  DOCTOR: "Doctor",
  NURSE: "Nurse",
  LAB_TECHNICIAN: "Lab Technician",
  PHARMACIST: "Pharmacist",
  INPATIENT_STAFF: "Inpatient Staff",
};

export type UserStatus = "ACTIVE" | "DISABLED";

export interface StaffUser {
  id: string;
  uid: string;
  fullName: string;
  email: string;
  phone?: string;
  role: Role;
  departmentId?: string | null;
  staffId?: string;
  status: UserStatus;
  createdAt?: Timestamp | null;
  lastActivityAt?: Timestamp | null;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt?: Timestamp | null;
}

export interface Service {
  id: string;
  name: string;
  departmentId: string | null;
  description?: string;
  price: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

export interface ServicePriceHistoryEntry {
  id: string;
  serviceId: string;
  previousPrice: number;
  newPrice: number;
  changedByUid: string;
  changedByName: string;
  changedAt?: Timestamp | null;
}

export interface HospitalSettings {
  hospitalName: string;
  logoUrl?: string;
  addressLine?: string;
  phone?: string;
  email?: string;
  currency: string;
  timezone: string;
  invoicePrefix: string;
  receiptFooter?: string;
  lowStockAlerts: boolean;
  expiryAlertDays: number;
}

export interface AuditLogEntry {
  id: string;
  actorUid: string;
  actorName: string;
  actorRole: Role | string;
  action: string;
  resource: string;
  resourceId?: string | null;
  description: string;
  createdAt?: Timestamp | null;
}
