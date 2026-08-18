import {
  addDoc,
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit as fsLimit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../firebase/client";
import { writeAuditLog, type Actor } from "./admin";
import type { Patient, PatientInput } from "../types";

/** Allocates the next sequential patient number atomically: HMS-2026-000042 */
export async function nextPatientNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const ref = doc(firestore(), "counters", `patients-${year}`);
  const seq = await runTransaction(firestore(), async (tx) => {
    const snap = await tx.get(ref);
    const current = snap.exists() ? Number((snap.data() as { seq?: number }).seq ?? 0) : 0;
    const next = current + 1;
    tx.set(ref, { seq: next, year }, { merge: true });
    return next;
  });
  return `HMS-${year}-${String(seq).padStart(6, "0")}`;
}

function searchIndex(input: PatientInput, patientNumber: string): string {
  return [
    patientNumber,
    input.firstName,
    input.lastName,
    input.otherNames,
    input.phone,
    input.nationalId,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export async function createPatient(actor: Actor, input: PatientInput): Promise<Patient> {
  const patientNumber = await nextPatientNumber();
  const payload = {
    ...input,
    patientNumber,
    search: searchIndex(input, patientNumber),
    status: "ACTIVE" as const,
    registeredByUid: actor.uid,
    registeredByName: actor.name,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(firestore(), "patients"), payload);
  await writeAuditLog(actor, {
    action: "PATIENT_REGISTERED",
    resource: "patients",
    resourceId: ref.id,
    description: `${actor.name} registered patient ${input.firstName} ${input.lastName} (${patientNumber}).`,
  });
  return { id: ref.id, ...payload, createdAt: null, updatedAt: null } as unknown as Patient;
}

export async function updatePatient(actor: Actor, patient: Patient, input: PatientInput) {
  await updateDoc(doc(firestore(), "patients", patient.id), {
    ...input,
    search: searchIndex(input, patient.patientNumber),
    updatedAt: serverTimestamp(),
  });
  await writeAuditLog(actor, {
    action: "PATIENT_UPDATED",
    resource: "patients",
    resourceId: patient.id,
    description: `${actor.name} updated patient record ${patient.patientNumber}.`,
  });
}

export async function setPatientStatus(actor: Actor, patient: Patient, status: Patient["status"]) {
  await updateDoc(doc(firestore(), "patients", patient.id), { status, updatedAt: serverTimestamp() });
  await writeAuditLog(actor, {
    action: "PATIENT_STATUS_CHANGED",
    resource: "patients",
    resourceId: patient.id,
    description: `${actor.name} set patient ${patient.patientNumber} to ${status}.`,
  });
}

export async function listPatients(max = 300): Promise<Patient[]> {
  const snap = await getDocs(
    query(collection(firestore(), "patients"), orderBy("createdAt", "desc"), fsLimit(max)),
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Patient, "id">) }));
}

export async function getPatient(id: string): Promise<Patient | null> {
  const snap = await getDoc(doc(firestore(), "patients", id));
  return snap.exists() ? { id: snap.id, ...(snap.data() as Omit<Patient, "id">) } : null;
}

export async function findPatientByNumber(patientNumber: string): Promise<Patient | null> {
  const snap = await getDocs(
    query(
      collection(firestore(), "patients"),
      where("patientNumber", "==", patientNumber.trim().toUpperCase()),
      fsLimit(1),
    ),
  );
  const first = snap.docs[0];
  return first ? { id: first.id, ...(first.data() as Omit<Patient, "id">) } : null;
}

export async function countPatients(): Promise<number> {
  try {
    const snap = await getCountFromServer(collection(firestore(), "patients"));
    return snap.data().count;
  } catch {
    return 0;
  }
}

export function filterPatients(patients: Patient[], term: string): Patient[] {
  const q = term.trim().toLowerCase();
  if (!q) return patients;
  return patients.filter((p) =>
    (p.search ?? `${p.patientNumber} ${p.firstName} ${p.lastName} ${p.phone ?? ""}`.toLowerCase())
      .includes(q),
  );
}

export function patientAge(dateOfBirth?: string): number | null {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age -= 1;
  return age >= 0 ? age : null;
}

export function patientFullName(p: Pick<Patient, "firstName" | "lastName" | "otherNames">): string {
  return [p.firstName, p.otherNames, p.lastName].filter(Boolean).join(" ");
}
