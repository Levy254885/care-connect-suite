import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { firebaseAuth } from "@/lib/firebase/client";
import { bootstrapFirstAdmin } from "@/lib/data/admin";
import { isBootstrapped } from "@/lib/data/bootstrap";
import { humanizeError } from "@/lib/errors";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingState } from "@/components/ui/state";

export const Route = createFileRoute("/setup")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "First-time setup — Hospital Management System" },
      {
        name: "description",
        content: "Create the first super administrator account for the hospital management system.",
      },
      { property: "og:title", content: "First-time setup — Hospital Management System" },
      { property: "og:description", content: "Create the first super administrator account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SetupPage,
});

function SetupPage() {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const bootstrapped = useQuery({
    queryKey: ["bootstrapped"],
    queryFn: isBootstrapped,
    retry: false,
  });
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || password.length < 8) {
      toast.error("Enter a full name, email and a password of at least 8 characters.");
      return;
    }
    setBusy(true);
    try {
      const auth = firebaseAuth();
      let uid: string;
      try {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        uid = cred.user.uid;
      } catch (error) {
        // The sign-in account may already exist from an earlier attempt that
        // failed before the staff profile was written. Reuse it.
        const code = (error as { code?: string }).code;
        if (code !== "auth/email-already-in-use") throw error;
        const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
        uid = cred.user.uid;
      }
      await bootstrapFirstAdmin(uid, fullName, email);
      await refreshProfile();
      toast.success("Super administrator ready. Welcome aboard.");
      await navigate({ to: "/dashboard", replace: true });
    } catch (error) {
      toast.error(humanizeError(error, "Could not complete setup."));
    } finally {
      setBusy(false);
    }
  }

  if (bootstrapped.isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <LoadingState label="Checking hospital directory…" />
      </main>
    );
  }

  if (bootstrapped.data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="panel max-w-md px-6 py-8 text-center">
          <h1 className="text-lg font-semibold">Setup already completed</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This hospital already has a super administrator. Sign in with your work email, or ask
            an administrator to create your staff account.
          </p>
          <Button className="mt-5" asChild>
            <Link to="/login">Go to sign in</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">First-time setup</h1>
            <p className="text-xs text-muted-foreground">Create the super administrator account</p>
          </div>
        </div>
        <form onSubmit={onSubmit} className="panel space-y-4 px-5 py-6">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Levy Batanga"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Work email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@hospital.co.ke"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Minimum 8 characters. No email verification is required.
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden /> : null}
            Create administrator
          </Button>
        </form>
      </div>
    </main>
  );
}
