import { useQuery } from "@tanstack/react-query";
import { DEFAULT_SETTINGS, getHospitalSettings } from "./data/admin";
import type { HospitalSettings } from "./types";

export function useHospitalSettings() {
  const query = useQuery({
    queryKey: ["hospital-settings"],
    queryFn: getHospitalSettings,
    staleTime: 5 * 60 * 1000,
  });
  const settings: HospitalSettings = query.data ?? DEFAULT_SETTINGS;
  return { settings, isLoading: query.isLoading };
}

export function formatMoney(amount: number, currency = "KES") {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}
