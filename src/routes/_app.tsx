import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { LoadingState } from "@/components/ui/state";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { bootstrapFirstAdmin } from "@/lib/data/admin";
import { isBootstrapped } from "@/lib/data/bootstrap";
import { humanizeError } from "@/lib/errors";

export const Route = createFileRoute("/_app")({
  ssr: false,
  component: AppLayout,
});

function AppLayout() {
  const { firebaseUser, profile, loading, profileMissing, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !firebaseUser) {
      void navigate({ to: "/login", replace: true });
    }
  }, [loading, firebaseUser, navigate]);

  if (loading || (!firebaseUser && !profileMissing)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoadingState label="Loading your workspace…" />
      </div>
    );
  }

  if (profileMissing || !profile) {
    return (
      <MissingProfile
        onSignOut={() => void signOut()}
        onClaimed={() => void refreshProfile()}
        uid={firebaseUser?.uid ?? ""}
        email={firebaseUser?.email ?? ""}
      />
    );
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

function MissingProfile({
  uid,
  email,
  onSignOut,
  onClaimed,
}: {
  uid: string;
  email: string;
  onSignOut: () => void;
  onClaimed: () => void;
}) {
  const bootstrapped = useQuery({ queryKey: ["bootstrapped"], queryFn: isBootstrapped, retry: false });
  const [busy, setBusy] = useState(false);

  // The signed-in account has no staff profile. If the hospital has never been
  // bootstrapped, this account can claim the super administrator seat.
  const canClaim = bootstrapped.isFetched && bootstrapped.data === false && Boolean(uid);

  async function claim() {
    setBusy(true);
    try {
      await bootstrapFirstAdmin(uid, email.split("@")[0] ?? "Administrator", email);
      toast.success("Super administrator profile created.");
      onClaimed();
    } catch (error) {
      toast.error(humanizeError(error, "Could not create the administrator profile."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="panel max-w-md px-6 py-8 text-center">
        <h1 className="text-lg font-semibold">No staff profile linked</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {canClaim
            ? "Your sign-in worked and this hospital has no administrator yet. Claim the super administrator seat to finish setup."
            : "Your sign-in worked, but this account has no staff profile in the hospital directory. Ask a hospital administrator to create your profile, then sign in again."}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {canClaim ? (
            <Button onClick={() => void claim()} disabled={busy}>
              {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden /> : null}
              Claim super administrator
            </Button>
          ) : null}
          <Button variant="outline" onClick={onSignOut}>
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
