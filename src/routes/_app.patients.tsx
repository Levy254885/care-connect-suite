import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Search, UserPlus } from "lucide-react";
import { PageHeader, Panel, PanelHeader, StatusBadge } from "@/components/ui/page";
import { EmptyState, LoadingState } from "@/components/ui/state";
import { ModuleGuard, useActor } from "@/components/layout/module-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPatient, filterPatients, listPatients, patientAge, patientFullName } from "@/lib/data/patients";
import { BLOOD_GROUPS, GENDERS, type BloodGroup, type Gender, type PatientInput } from "@/lib/types";
import { humanizeError } from "@/lib/errors";

export const Route = createFileRoute("/_app/patients")({
  head: () => ({
    meta: [
      { title: "Patients — Hospital Management System" },
      { name: "description", content: "Search, register and manage patient records." },
      { property: "og:title", content: "Patients — Hospital Management System" },
      { property: "og:description", content: "Search, register and manage patient records." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <ModuleGuard module="patients">
      <PatientsPage />
    </ModuleGuard>
  ),
});

const EMPTY: PatientInput = {
  firstName: "",
  lastName: "",
  otherNames: "",
  dateOfBirth: "",
  gender: "MALE",
  phone: "",
  email: "",
  nationalId: "",
  address: "",
  county: "",
  bloodGroup: "UNKNOWN",
  allergies: "",
  chronicConditions: "",
  nextOfKin: { name: "", relationship: "", phone: "" },
  insurance: { provider: "", memberNumber: "", scheme: "" },
  notes: "",
};

function PatientsPage() {
  const actor = useActor();
  const qc = useQueryClient();
  const patients = useQuery({ queryKey: ["patients"], queryFn: () => listPatients() });
  const [term, setTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<PatientInput>(EMPTY);

  const set = <K extends keyof PatientInput>(key: K, value: PatientInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const results = useMemo(() => filterPatients(patients.data ?? [], term), [patients.data, term]);

  const create = useMutation({
    mutationFn: () => createPatient(actor, form),
    onSuccess: (p) => {
      toast.success(`Patient registered as ${p.patientNumber}.`);
      setForm(EMPTY);
      setShowForm(false);
      void qc.invalidateQueries({ queryKey: ["patients"] });
      void qc.invalidateQueries({ queryKey: ["patients-count"] });
    },
    onError: (e) => toast.error(humanizeError(e, "Could not register the patient.")),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patients"
        description="Master patient index with unique hospital numbers."
        actions={
          <Button onClick={() => setShowForm((s) => !s)}>
            <UserPlus className="h-4 w-4" aria-hidden />
            {showForm ? "Close form" : "Register patient"}
          </Button>
        }
      />

      {showForm ? (
        <Panel>
          <PanelHeader title="Register a new patient" description="A hospital number is allocated automatically." />
          <form
            className="grid gap-4 px-5 py-5 sm:grid-cols-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (!form.firstName.trim() || !form.lastName.trim() || !form.dateOfBirth) {
                toast.error("First name, last name and date of birth are required.");
                return;
              }
              create.mutate();
            }}
          >
            <Field label="First name" id="firstName">
              <Input id="firstName" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
            </Field>
            <Field label="Last name" id="lastName">
              <Input id="lastName" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
            </Field>
            <Field label="Other names" id="otherNames">
              <Input id="otherNames" value={form.otherNames ?? ""} onChange={(e) => set("otherNames", e.target.value)} />
            </Field>
            <Field label="Date of birth" id="dob">
              <Input id="dob" type="date" value={form.dateOfBirth} onChange={(e) => set("dateOfBirth", e.target.value)} />
            </Field>
            <Field label="Gender" id="gender">
              <select
                id="gender"
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={form.gender}
                onChange={(e) => set("gender", e.target.value as Gender)}
              >
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Blood group" id="blood">
              <select
                id="blood"
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={form.bloodGroup}
                onChange={(e) => set("bloodGroup", e.target.value as BloodGroup)}
              >
                {BLOOD_GROUPS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Phone" id="phone">
              <Input id="phone" value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
            </Field>
            <Field label="National ID" id="nationalId">
              <Input id="nationalId" value={form.nationalId ?? ""} onChange={(e) => set("nationalId", e.target.value)} />
            </Field>
            <Field label="County" id="county">
              <Input id="county" value={form.county ?? ""} onChange={(e) => set("county", e.target.value)} />
            </Field>
            <Field label="Next of kin name" id="kinName">
              <Input
                id="kinName"
                value={form.nextOfKin.name}
                onChange={(e) => set("nextOfKin", { ...form.nextOfKin, name: e.target.value })}
              />
            </Field>
            <Field label="Next of kin phone" id="kinPhone">
              <Input
                id="kinPhone"
                value={form.nextOfKin.phone}
                onChange={(e) => set("nextOfKin", { ...form.nextOfKin, phone: e.target.value })}
              />
            </Field>
            <Field label="Relationship" id="kinRel">
              <Input
                id="kinRel"
                value={form.nextOfKin.relationship}
                onChange={(e) => set("nextOfKin", { ...form.nextOfKin, relationship: e.target.value })}
              />
            </Field>
            <Field label="Insurance provider" id="ins">
              <Input
                id="ins"
                value={form.insurance.provider ?? ""}
                onChange={(e) => set("insurance", { ...form.insurance, provider: e.target.value })}
              />
            </Field>
            <Field label="Member number" id="insNo">
              <Input
                id="insNo"
                value={form.insurance.memberNumber ?? ""}
                onChange={(e) => set("insurance", { ...form.insurance, memberNumber: e.target.value })}
              />
            </Field>
            <Field label="Known allergies" id="allergies">
              <Input id="allergies" value={form.allergies ?? ""} onChange={(e) => set("allergies", e.target.value)} />
            </Field>
            <div className="sm:col-span-3">
              <Button type="submit" disabled={create.isPending}>
                Register patient
              </Button>
            </div>
          </form>
        </Panel>
      ) : null}

      <Panel>
        <PanelHeader
          title="Patient index"
          description={`${results.length} of ${patients.data?.length ?? 0} records`}
          actions={
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden />
              <Input
                className="w-56 pl-8"
                placeholder="Search name, number, phone"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                aria-label="Search patients"
              />
            </div>
          }
        />
        {patients.isLoading ? (
          <LoadingState label="Loading patients…" />
        ) : results.length === 0 ? (
          <EmptyState title="No patients found" description="Register a patient to start building the index." />
        ) : (
          <ul className="divide-y divide-border">
            {results.map((p) => {
              const age = patientAge(p.dateOfBirth);
              return (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <Link
                      to="/patients/$patientId"
                      params={{ patientId: p.id }}
                      className="text-sm font-medium hover:underline"
                    >
                      {patientFullName(p)}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {p.patientNumber} · {p.gender}
                      {age !== null ? ` · ${age} yrs` : ""}
                      {p.phone ? ` · ${p.phone}` : ""}
                    </p>
                  </div>
                  <StatusBadge tone={p.status === "ACTIVE" ? "success" : "neutral"}>{p.status}</StatusBadge>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}
