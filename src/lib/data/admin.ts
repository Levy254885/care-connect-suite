import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { deleteApp, getApp, getApps, initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail } from "firebase/auth";
import { firestore } from "../firebase/client";
import type {
  AuditLogEntry,
  Department,
  HospitalSettings,
  Role,
  Service,
  ServicePriceHistoryEntry,
  StaffUser,
} from "../types";

/* ---------------------------------- audit --------------------------------- */

export interface Actor {
  uid: string;
  name: string;
  role: Role | string;
}

export async function writeAuditLog(
  actor: Actor,
  entry: { action: string; resource: string; resourceId?: string | null; description: string },
) {
  await addDoc(collection(firestore(), "auditLogs"), {
    actorUid: actor.uid,
    actorName: actor.name,
    actorRole: actor.role,
    action: entry.action,
    resource: entry.resource,
    resourceId: entry.resourceId ?? null,
    description: entry.description,
    createdAt: serverTimestamp(),
  });
}

export async function listAuditLogs(max = 100): Promise<AuditLogEntry[]> {
  const snap = await getDocs(
    query(collection(firestore(), "auditLogs"), orderBy("createdAt", "desc"), limit(max)),
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<AuditLogEntry, "id">) }));
}

/* ---------------------------------- users --------------------------------- */

export async function countUsers(): Promise<number> {
  const snap = await getCountFromServer(collection(firestore(), "users"));
  return snap.data().count;
}

export async function listUsers(): Promise<StaffUser[]> {
  const snap = await getDocs(query(collection(firestore(), "users"), orderBy("fullName")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<StaffUser, "id">) }));
}

export async function getUserProfile(uid: string): Promise<StaffUser | null> {
  const snap = await getDoc(doc(firestore(), "users", uid));
  return snap.exists() ? { id: snap.id, ...(snap.data() as Omit<StaffUser, "id">) } : null;
}

export interface NewUserInput {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  role: Role;
  departmentId?: string | null;
  staffId?: string;
}

/**
 * Creates the Firebase Auth account on a secondary app instance so the signed-in
 * administrator's own session is never replaced, then writes the users/{uid} profile.
 */
export async function createStaffUser(actor: Actor, input: NewUserInput): Promise<string> {
  const primary = getApp();
  const secondaryName = "staff-provisioning";
  const existing = getApps().find((a) => a.name === secondaryName);
  const secondary = existing ?? initializeApp(primary.options, secondaryName);
  try {
    const cred = await createUserWithEmailAndPassword(
      getAuth(secondary),
      input.email.trim(),
      input.password,
    );
    const uid = cred.user.uid;
    await setDoc(doc(firestore(), "users", uid), {
      uid,
      fullName: input.fullName.trim(),
      email: input.email.trim(),
      phone: input.phone ?? "",
      role: input.role,
      departmentId: input.departmentId ?? null,
      staffId: input.staffId ?? "",
      status: "ACTIVE",
      createdAt: serverTimestamp(),
      lastActivityAt: null,
    });
    await getAuth(secondary).signOut();
    await writeAuditLog(actor, {
      action: "USER_CREATED",
      resource: "users",
      resourceId: uid,
      description: `${actor.name} created user ${input.fullName} (${input.role}).`,
    });
    return uid;
  } finally {
    if (!existing) await deleteApp(secondary).catch(() => undefined);
  }
}

/** Bootstraps the very first SUPER_ADMIN. Only allowed while users/ is empty. */
export async function bootstrapFirstAdmin(uid: string, fullName: string, email: string) {
  const { markBootstrapped } = await import("./bootstrap");
  await setDoc(doc(firestore(), "users", uid), {
    uid,
    fullName: fullName.trim(),
    email: email.trim(),
    phone: "",
    role: "SUPER_ADMIN" as Role,
    departmentId: null,
    staffId: "",
    status: "ACTIVE",
    createdAt: serverTimestamp(),
    lastActivityAt: serverTimestamp(),
  });
  await markBootstrapped(uid, email.trim());
}

export async function updateStaffUser(
  actor: Actor,
  uid: string,
  patch: Partial<Pick<StaffUser, "fullName" | "phone" | "role" | "departmentId" | "staffId" | "status">>,
) {
  await updateDoc(doc(firestore(), "users", uid), patch);
  await writeAuditLog(actor, {
    action: "USER_UPDATED",
    resource: "users",
    resourceId: uid,
    description: `${actor.name} updated user profile ${uid}.`,
  });
}

export async function sendUserPasswordReset(actor: Actor, email: string) {
  const { firebaseAuth } = await import("../firebase/client");
  await sendPasswordResetEmail(firebaseAuth(), email);
  await writeAuditLog(actor, {
    action: "PASSWORD_RESET_SENT",
    resource: "users",
    resourceId: email,
    description: `${actor.name} sent a password reset email to ${email}.`,
  });
}

/* ------------------------------- departments ------------------------------ */

export async function listDepartments(): Promise<Department[]> {
  const snap = await getDocs(query(collection(firestore(), "departments"), orderBy("name")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Department, "id">) }));
}

export async function createDepartment(
  actor: Actor,
  input: Omit<Department, "id" | "createdAt">,
): Promise<string> {
  const ref = await addDoc(collection(firestore(), "departments"), {
    ...input,
    createdAt: serverTimestamp(),
  });
  await writeAuditLog(actor, {
    action: "DEPARTMENT_CREATED",
    resource: "departments",
    resourceId: ref.id,
    description: `${actor.name} created department ${input.name}.`,
  });
  return ref.id;
}

export async function updateDepartment(actor: Actor, id: string, patch: Partial<Department>) {
  await updateDoc(doc(firestore(), "departments", id), patch);
  await writeAuditLog(actor, {
    action: "DEPARTMENT_UPDATED",
    resource: "departments",
    resourceId: id,
    description: `${actor.name} updated department ${patch.name ?? id}.`,
  });
}

export async function deleteDepartment(actor: Actor, id: string, name: string) {
  await deleteDoc(doc(firestore(), "departments", id));
  await writeAuditLog(actor, {
    action: "DEPARTMENT_DELETED",
    resource: "departments",
    resourceId: id,
    description: `${actor.name} deleted department ${name}.`,
  });
}

const DEFAULT_DEPARTMENTS: Array<Omit<Department, "id" | "createdAt">> = [
  { name: "Reception", code: "REC", status: "ACTIVE", description: "Front desk and registration" },
  { name: "Billing", code: "BIL", status: "ACTIVE", description: "Invoicing and payments" },
  { name: "Consultation", code: "CON", status: "ACTIVE", description: "Outpatient clinics" },
  { name: "Laboratory", code: "LAB", status: "ACTIVE", description: "Diagnostics and testing" },
  { name: "Pharmacy", code: "PHA", status: "ACTIVE", description: "Dispensing and inventory" },
  { name: "Inpatient", code: "IPD", status: "ACTIVE", description: "Wards and admissions" },
];

export async function seedCoreDepartments(actor: Actor) {
  const existing = await listDepartments();
  const codes = new Set(existing.map((d) => d.code));
  const batch = writeBatch(firestore());
  let added = 0;
  for (const dept of DEFAULT_DEPARTMENTS) {
    if (codes.has(dept.code)) continue;
    batch.set(doc(collection(firestore(), "departments")), { ...dept, createdAt: serverTimestamp() });
    added += 1;
  }
  if (added > 0) {
    await batch.commit();
    await writeAuditLog(actor, {
      action: "DEPARTMENTS_INITIALISED",
      resource: "departments",
      description: `${actor.name} initialised ${added} core hospital departments.`,
    });
  }
  return added;
}

/* --------------------------------- services -------------------------------- */

export async function listServices(): Promise<Service[]> {
  const snap = await getDocs(query(collection(firestore(), "services"), orderBy("name")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Service, "id">) }));
}

export async function createService(
  actor: Actor,
  input: Omit<Service, "id" | "createdAt" | "updatedAt">,
) {
  const ref = await addDoc(collection(firestore(), "services"), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await writeAuditLog(actor, {
    action: "SERVICE_CREATED",
    resource: "services",
    resourceId: ref.id,
    description: `${actor.name} created service ${input.name} at KES ${input.price}.`,
  });
  return ref.id;
}

export async function updateService(
  actor: Actor,
  service: Service,
  patch: Partial<Omit<Service, "id">>,
) {
  await updateDoc(doc(firestore(), "services", service.id), { ...patch, updatedAt: serverTimestamp() });
  if (patch.price !== undefined && patch.price !== service.price) {
    await addDoc(collection(firestore(), "services", service.id, "priceHistory"), {
      serviceId: service.id,
      previousPrice: service.price,
      newPrice: patch.price,
      changedByUid: actor.uid,
      changedByName: actor.name,
      changedAt: serverTimestamp(),
    });
  }
  await writeAuditLog(actor, {
    action: "SERVICE_UPDATED",
    resource: "services",
    resourceId: service.id,
    description: `${actor.name} updated service ${service.name}.`,
  });
}

export async function listServicePriceHistory(serviceId: string): Promise<ServicePriceHistoryEntry[]> {
  const snap = await getDocs(
    query(collection(firestore(), "services", serviceId, "priceHistory"), orderBy("changedAt", "desc")),
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ServicePriceHistoryEntry, "id">) }));
}

/* --------------------------------- settings -------------------------------- */

export const DEFAULT_SETTINGS: HospitalSettings = {
  hospitalName: "Hospital Management System",
  addressLine: "",
  phone: "",
  email: "",
  currency: "KES",
  timezone: "Africa/Nairobi",
  invoicePrefix: "INV",
  receiptFooter: "Thank you for choosing us.",
  lowStockAlerts: true,
  expiryAlertDays: 90,
};

export async function getHospitalSettings(): Promise<HospitalSettings> {
  const snap = await getDoc(doc(firestore(), "settings", "hospital"));
  if (!snap.exists()) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...(snap.data() as Partial<HospitalSettings>) };
}

export async function saveHospitalSettings(actor: Actor, settings: HospitalSettings) {
  await setDoc(
    doc(firestore(), "settings", "hospital"),
    { ...settings, updatedAt: serverTimestamp() },
    { merge: true },
  );
  await writeAuditLog(actor, {
    action: "SETTINGS_UPDATED",
    resource: "settings",
    resourceId: "hospital",
    description: `${actor.name} updated hospital settings.`,
  });
}

/* -------------------------------- dashboard -------------------------------- */

export async function countCollection(path: string): Promise<number> {
  try {
    const snap = await getCountFromServer(collection(firestore(), path));
    return snap.data().count;
  } catch {
    return 0;
  }
}

export async function countActiveUsers(): Promise<number> {
  try {
    const snap = await getCountFromServer(
      query(collection(firestore(), "users"), where("status", "==", "ACTIVE")),
    );
    return snap.data().count;
  } catch {
    return 0;
  }
}
