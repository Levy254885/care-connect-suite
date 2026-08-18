import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { LoadingState } from "@/components/ui/state";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app")({
  ssr: false,
  component: AppLayout,
});

function AppLayout() {
  const { firebaseUser, profile, loading, profileMissing, signOut } = useAuth();
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
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="panel max-w-md px-6 py-8 text-center">
          <h1 className="text-lg font-semibold">No staff profile linked</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your sign-in worked, but this account has no staff profile in the hospital directory.
            Ask a hospital administrator to create your profile, then sign in again.
          </p>
          <Button className="mt-5" variant="outline" onClick={() => void signOut()}>
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
