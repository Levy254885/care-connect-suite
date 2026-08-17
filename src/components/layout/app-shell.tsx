import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Banknote,
  Building2,
  CalendarDays,
  ClipboardList,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  Menu,
  Pill,
  ScrollText,
  Settings,
  Stethoscope,
  Users,
  UserSquare2,
  BedDouble,
  Bell,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { canAccess, type ModuleKey } from "@/lib/permissions";
import { ROLE_LABELS } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useHospitalSettings } from "@/lib/use-hospital-settings";

interface NavItem {
  label: string;
  to: string;
  module: ModuleKey;
  icon: typeof LayoutDashboard;
  ready: boolean;
}

const NAV: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", module: "dashboard", icon: LayoutDashboard, ready: true },
  { label: "Patients", to: "/patients", module: "patients", icon: UserSquare2, ready: false },
  { label: "Reception", to: "/reception", module: "reception", icon: ClipboardList, ready: false },
  { label: "Appointments", to: "/appointments", module: "appointments", icon: CalendarDays, ready: false },
  { label: "Billing", to: "/billing", module: "billing", icon: Banknote, ready: false },
  { label: "Consultation", to: "/consultation", module: "consultation", icon: Stethoscope, ready: false },
  { label: "Laboratory", to: "/laboratory", module: "laboratory", icon: FlaskConical, ready: false },
  { label: "Pharmacy", to: "/pharmacy", module: "pharmacy", icon: Pill, ready: false },
  { label: "Inpatient", to: "/inpatient", module: "inpatient", icon: BedDouble, ready: false },
  { label: "Reports", to: "/reports", module: "reports", icon: Activity, ready: false },
  { label: "Notifications", to: "/notifications", module: "notifications", icon: Bell, ready: false },
];

const ADMIN_NAV: NavItem[] = [
  { label: "Users & Staff", to: "/users", module: "users", icon: Users, ready: true },
  { label: "Departments", to: "/departments", module: "departments", icon: Building2, ready: true },
  { label: "Services & Prices", to: "/services", module: "services", icon: ScrollText, ready: true },
  { label: "Audit Logs", to: "/audit-logs", module: "audit", icon: ScrollText, ready: true },
  { label: "Settings", to: "/settings", module: "settings", icon: Settings, ready: true },
];

function NavLinks({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <ul className="space-y-0.5">
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.to;
        if (!item.ready) {
          return (
            <li key={item.to}>
              <span
                className="flex cursor-not-allowed items-center gap-2.5 rounded-md px-3 py-2 text-sm text-sidebar-foreground/40"
                title="Available in an upcoming build phase"
              >
                <Icon className="h-4 w-4" aria-hidden />
                {item.label}
                <span className="ml-auto text-[10px] uppercase tracking-wide">soon</span>
              </span>
            </li>
          );
        }
        return (
          <li key={item.to}>
            <Link
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/85 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { profile, signOut } = useAuth();
  const { settings } = useHospitalSettings();
  const [open, setOpen] = useState(false);

  const role = profile?.role;
  const main = NAV.filter((i) => canAccess(role, i.module));
  const admin = ADMIN_NAV.filter((i) => canAccess(role, i.module));

  const sidebar = (onNavigate?: () => void) => (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2.5 border-b border-sidebar-border px-4 py-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
          <Activity className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{settings.hospitalName}</p>
          <p className="text-[11px] text-sidebar-foreground/60">Hospital Management System</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-2.5 py-4">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/45">
          Clinical & Front Office
        </p>
        <NavLinks items={main} onNavigate={onNavigate} />
        {admin.length > 0 ? (
          <>
            <p className="px-3 pt-5 pb-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/45">
              Administration
            </p>
            <NavLinks items={admin} onNavigate={onNavigate} />
          </>
        ) : null}
      </nav>
      <div className="border-t border-sidebar-border px-4 py-3">
        <p className="truncate text-sm font-medium">{profile?.fullName}</p>
        <p className="text-xs text-sidebar-foreground/60">
          {profile ? ROLE_LABELS[profile.role] : ""}
        </p>
        <button
          onClick={() => void signOut()}
          className="mt-3 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-4 w-4" aria-hidden /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border lg:block">
        <div className="sticky top-0 h-screen">{sidebar()}</div>
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 w-72 shadow-raised">{sidebar(() => setOpen(false))}</div>
          <button
            className="absolute right-4 top-4 rounded-md bg-surface p-2 text-foreground"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border bg-surface px-4 py-3 lg:hidden">
          <Button variant="outline" size="icon" onClick={() => setOpen(true)} aria-label="Open navigation">
            <Menu className="h-4 w-4" />
          </Button>
          <span className="truncate text-sm font-semibold">{settings.hospitalName}</span>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
