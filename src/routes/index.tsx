import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, BedDouble, FlaskConical, ShieldCheck, Stethoscope, Users } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hospital Management System — Staff Portal" },
      {
        name: "description",
        content:
          "Role-based hospital management system covering patient records, reception, consultation, laboratory, pharmacy, billing and inpatient care.",
      },
      { property: "og:title", content: "Hospital Management System — Staff Portal" },
      {
        property: "og:description",
        content:
          "Secure, role-based hospital operations: patients, clinics, laboratory, pharmacy, billing and wards.",
      },
    ],
  }),
  component: Index,
});

const FEATURES = [
  { icon: Users, title: "Patient records", body: "Unique patient numbers, full demographics and medical history." },
  { icon: Stethoscope, title: "Clinical workflow", body: "Reception to consultation, orders and results in one queue." },
  { icon: FlaskConical, title: "Laboratory", body: "Test ordering, sample tracking and verified result release." },
  { icon: BedDouble, title: "Inpatient care", body: "Admissions, ward and bed management, daily charges." },
];

function Index() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Activity className="h-4 w-4" aria-hidden />
            </span>
            <span className="text-sm font-semibold">Hospital Management System</span>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Staff sign in
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden /> Role-based, audited access
        </p>
        <h1 className="mt-5 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
          One connected record for every patient, every department, every shift.
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Reception, consultation, laboratory, pharmacy, billing and inpatient care share the same
          live patient record. Every action is permission-checked and written to the audit trail.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Sign in to your workspace
          </Link>
          <SetupLink />
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="panel px-5 py-5">
                <Icon className="h-5 w-5 text-primary" aria-hidden />
                <h2 className="mt-3 text-sm font-semibold">{f.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
