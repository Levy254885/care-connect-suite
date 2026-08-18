import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Activity, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { humanizeError } from "@/lib/errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Staff sign in — Hospital Management System" },
      { name: "description", content: "Secure staff sign in for the hospital management system." },
      { property: "og:title", content: "Staff sign in — Hospital Management System" },
      { property: "og:description", content: "Secure staff sign in for hospital staff accounts." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn, resetPassword, firebaseUser, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && firebaseUser) void navigate({ to: "/dashboard", replace: true });
  }, [loading, firebaseUser, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Enter your email and password.");
      return;
    }
    setBusy(true);
    try {
      await signIn(email, password);
      await navigate({ to: "/dashboard", replace: true });
    } catch (error) {
      toast.error(humanizeError(error, "Sign in failed."));
    } finally {
      setBusy(false);
    }
  }

  async function onReset() {
    if (!email) {
      toast.error("Enter your email address first, then choose reset.");
      return;
    }
    try {
      await resetPassword(email);
      toast.success("Password reset email sent.");
    } catch (error) {
      toast.error(humanizeError(error, "Could not send the reset email."));
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Activity className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Hospital Management System</h1>
            <p className="text-xs text-muted-foreground">Authorised staff access only</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="panel space-y-4 px-5 py-6">
          <div className="space-y-1.5">
            <Label htmlFor="email">Work email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
            Sign in
          </Button>
          <button
            type="button"
            onClick={() => void onReset()}
            className="w-full text-center text-xs text-muted-foreground underline-offset-2 hover:underline"
          >
            Forgot your password?
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Setting up a brand new hospital?{" "}
          <Link to="/setup" className="underline underline-offset-2">
            Create the first administrator
          </Link>
        </p>
      </div>
    </main>
  );
}
