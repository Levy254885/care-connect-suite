import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { PageHeader, Panel, PanelHeader, StatusBadge } from "@/components/ui/page";
import { EmptyState, LoadingState } from "@/components/ui/state";
import { ModuleGuard, useActor } from "@/components/layout/module-guard";
import { Button } from "@/components/ui/button";
import { getPatient, patientAge, patientFullName, setPatientStatus } from "@/lib/data/patients";
import { humanizeError } from "@/lib/errors";
import type { Patient } from "@/lib/types";

export const Route = createFileRoute("/_app/patients_/$patientId")({
  head: () => ({
    meta: [
      { title: "Patient record — Hospital Management System" },
      { name: "description", content: "Full demographic and clinical summary for a registered patient." },
      { property: "og:title", content: "Patient record — Hospital Management System" },
      { property: "og:description", content: "Full demographic and clinical summary for a registered patient." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <ModuleGuard module="patients">
      <PatientDetailPage />
    </ModuleGuard>
  ),
});

function PatientDetailPage() {
  const { patientId } = useParams({ from: "/_app/patients_/$patientId" });
  const actor = useActor();
  const qc = useQueryClient();
  const patient = useQuery({ queryKey: ["patient", patientId], queryFn: () => getPatient(patientId) });

  const toggle = useMutation({
    mutationFn: (p: Patient) => setPatientStatus(actor, p, p.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"),
    onSuccess: () => {
      toast.success("Patient status updated.");
      void qc.invalidateQueries({ queryKey: ["patient", patientId] });
      void qc.invalidateQueries({ queryKey: ["patients"] });
    },
    onError: (e) => toast.error(humanizeError(e, "Could not update the patient.")),
  });

  if (patient.isLoading) return <LoadingState label="Loading patient record…" />;
  const p = patient.data;
  if (!p) {
    return (
      <EmptyState
        title="Patient not found"
        description="This record may have been removed."
        action={
          <Button asChild variant="outline">
            <Link to="/patients">Back to patients</Link>
          </Button>
        }
      />
    );
  }

  const age = patientAge(p.dateOfBirth);

  return (
    <div className="space-y-6">
      <PageHeader
        title={patientFullName(p)}
        description={`${p.patientNumber} · ${p.gender}${age !== null ? ` · ${age} years` : ""}`}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge tone={p.status === "ACTIVE" ? "success" : "neutral"}>{p.status}</StatusBadge>
            <Button variant="outline" onClick={() => toggle.mutate(p)} disabled={toggle.isPending}>
              {p.status === "ACTIVE" ? "Mark inactive" : "Reactivate"}
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/patients">
                <ArrowLeft className="h-4 w-4" aria-hidden /> Patients
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="Demographics" />
          <dl className="divide-y divide-border">
            <Row label="Date of birth" value={p.dateOfBirth} />
            <Row label="Gender" value={p.gender} />
            <Row label="Blood group" value={p.bloodGroup} />
            <Row label="Phone" value={p.phone} />
            <Row label="Email" value={p.email} />
            <Row label="National ID" value={p.nationalId} />
            <Row label="Address" value={[p.address, p.county].filter(Boolean).join(", ")} />
          </dl>
        </Panel>

        <Panel>
          <PanelHeader title="Clinical flags" />
          <dl className="divide-y divide-border">
            <Row label="Allergies" value={p.allergies} />
            <Row label="Chronic conditions" value={p.chronicConditions} />
            <Row label="Notes" value={p.notes} />
          </dl>
        </Panel>

        <Panel>
          <PanelHeader title="Next of kin" />
          <dl className="divide-y divide-border">
            <Row label="Name" value={p.nextOfKin?.name} />
            <Row label="Relationship" value={p.nextOfKin?.relationship} />
            <Row label="Phone" value={p.nextOfKin?.phone} />
          </dl>
        </Panel>

        <Panel>
          <PanelHeader title="Insurance & registration" />
          <dl className="divide-y divide-border">
            <Row label="Provider" value={p.insurance?.provider} />
            <Row label="Member number" value={p.insurance?.memberNumber} />
            <Row label="Registered by" value={p.registeredByName} />
          </dl>
        </Panel>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null | undefined }) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-3">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm">{value && value.length > 0 ? value : "—"}</dd>
    </div>
  );
}
