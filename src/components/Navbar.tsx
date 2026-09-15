import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TreePine, Users, Wallet, ClipboardList, ShieldCheck, ChevronDown, Globe, LayoutDashboard } from "lucide-react";
import type { Role } from "../types";
import { useApp } from "../context/AppContext";
import { BRAND_NAME, CURRENCIES } from "../data/mockData";
import { cn } from "../lib/utils";

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: { id: string; label: string }[];
}

const ROLE_OPTIONS: { role: Role; label: string; icon: typeof Users }[] = [
  { role: "public", label: "Public", icon: Globe },
  { role: "donor", label: "Donor", icon: LayoutDashboard },
  { role: "cfa", label: "Community CFA", icon: Users },
  { role: "field", label: "Field Officer", icon: ClipboardList },
  { role: "admin", label: "Admin", icon: ShieldCheck },
];

export function Navbar({ activeTab, onTabChange, tabs }: NavbarProps) {
  const { state, setRole, setCurrency } = useApp();
  const [roleOpen, setRoleOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const totalTrees = state.projects.reduce((acc, p) => acc + p.plantedTrees, 0);
  const totalFunded = state.projects.reduce((acc, p) => acc + p.fundedKsh, 0);
  const activeRole = ROLE_OPTIONS.find((r) => r.role === state.role) ?? ROLE_OPTIONS[0];
  const ActiveIcon = activeRole.icon;

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-900/10 bg-stone-50/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <button
          onClick={() => onTabChange("home")}
          className="flex items-center gap-2 text-left"
          aria-label={`${BRAND_NAME} home`}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-800 text-stone-50 shadow-sm">
            <TreePine className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <span className="hidden sm:block">
            <span className="block text-sm font-bold tracking-tight text-emerald-950">{BRAND_NAME}</span>
            <span className="block text-[10px] font-medium uppercase tracking-widest text-amber-700">
              Kenya Reforestation
            </span>
          </span>
        </button>

        <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Primary">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className={cn(
                "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                activeTab === t.id ? "text-emerald-900" : "text-stone-500 hover:text-emerald-800",
              )}
            >
              {activeTab === t.id && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-lg bg-emerald-100/70"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">{t.label}</span>
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-xl border border-emerald-900/10 bg-white px-3 py-1.5 md:flex">
            <TreePine className="h-4 w-4 text-emerald-700" strokeWidth={2} />
            <span className="font-mono text-sm font-semibold text-emerald-950">
              {totalTrees.toLocaleString()}
            </span>
            <span className="text-xs text-stone-400">trees</span>
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setCurrencyOpen((v) => !v);
                setRoleOpen(false);
              }}
              className="flex h-9 items-center gap-1.5 rounded-xl border border-emerald-900/10 bg-white px-3 text-sm font-medium text-emerald-950 hover:bg-emerald-50"
            >
              <Globe className="h-4 w-4 text-emerald-700" strokeWidth={2} />
              <span className="hidden sm:inline">
                {state.currency === "KES" ? "KSh" : "$"}
              </span>
              <ChevronDown className={cn("h-3.5 w-3.5 text-stone-400 transition-transform", currencyOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
              {currencyOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-1 w-36 overflow-hidden rounded-xl border border-emerald-900/10 bg-white p-1 shadow-xl"
                >
                  {CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCurrency(c.code as "KES" | "USD");
                        setCurrencyOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-emerald-50",
                        state.currency === c.code ? "font-semibold text-emerald-800" : "text-stone-600",
                      )}
                    >
                      {c.code}
                      {state.currency === c.code && <span className="text-amber-600">✓</span>}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setRoleOpen((v) => !v);
                setCurrencyOpen(false);
              }}
              className="flex h-9 items-center gap-1.5 rounded-xl bg-emerald-800 px-3 text-sm font-medium text-stone-50 shadow-sm hover:bg-emerald-700"
            >
              <ActiveIcon className="h-4 w-4" strokeWidth={2} />
              <span className="hidden sm:inline">{activeRole.label}</span>
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", roleOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
              {roleOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-1 w-56 overflow-hidden rounded-xl border border-emerald-900/10 bg-white p-1 shadow-xl"
                >
                  {ROLE_OPTIONS.map((r) => {
                    const Icon = r.icon;
                    return (
                      <button
                        key={r.role}
                        onClick={() => {
                          setRole(r.role);
                          setRoleOpen(false);
                          onTabChange("impact");
                        }}
                        className={cn(
                          "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm hover:bg-emerald-50",
                          state.role === r.role ? "font-semibold text-emerald-800" : "text-stone-600",
                        )}
                      >
                        <Icon className="h-4 w-4 text-emerald-700" strokeWidth={2} />
                        {r.label}
                        {state.role === r.role && <span className="ml-auto text-xs font-bold text-amber-600">●</span>}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="border-t border-emerald-900/5 px-4 py-1.5 sm:px-6 lg:hidden">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                onTabChange(t.id);
                setMobileNavOpen(false);
              }}
              className={cn(
                "whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium",
                activeTab === t.id ? "bg-emerald-800 text-stone-50" : "text-stone-500",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="border-t border-emerald-900/10 bg-white px-4 py-2 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className="hidden items-center justify-between border-t border-emerald-900/5 bg-emerald-950 px-4 py-1.5 text-[11px] text-emerald-200/80 sm:flex sm:px-6 md:justify-end md:gap-8">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
          National verified pipeline · {totalTrees.toLocaleString()} trees planted · KSh {Math.round(totalFunded / 1_000_000)}M funded
        </span>
        <span className="hidden md:inline">Tree impact and carbon credits are tracked separately. Transparency first.</span>
      </div>
    </header>
  );
}