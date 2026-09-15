import { useState } from "react";
import { Toaster } from "sonner";
import { AppProvider } from "./context/AppContext";
import { Navbar } from "./components/Navbar";
import { LandingCalculator } from "./components/LandingCalculator";
import { ProjectMarketplace } from "./components/ProjectMarketplace";
import { PortalsAndMRV } from "./components/PortalsAndMRV";
import { BRAND_NAME, NATIONAL_METRICS } from "./data/mockData";
import { cn } from "./lib/utils";

const TABS = [
  { id: "home", label: "Impact & Calculator" },
  { id: "marketplace", label: "Project Marketplace" },
  { id: "impact", label: "Portals & MRV" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <AppProvider>
      <div className="min-h-screen bg-stone-50 font-sans text-stone-800 antialiased">
        <Navbar activeTab={activeTab} onTabChange={setActiveTab} tabs={TABS} />

        <main>
          {activeTab === "home" && <LandingCalculator />}
          {activeTab === "marketplace" && <ProjectMarketplace />}
          {activeTab === "impact" && <PortalsAndMRV />}
        </main>

        <footer className="border-t border-emerald-900/10 bg-emerald-950">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
            <div className="grid gap-8 md:grid-cols-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-emerald-950">
                    <span className="text-lg font-extrabold">🌳</span>
                  </span>
                  <div>
                    <p className="text-sm font-bold text-stone-50">{BRAND_NAME}</p>
                    <p className="text-[10px] font-medium uppercase tracking-widest text-amber-400">Kenya Reforestation</p>
                  </div>
                </div>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-emerald-200/70">
                  A transparent, community-incentivized climate finance and reforestation ecosystem for Kenya —
                  verified tracking that separates tree-planting impact from carbon credits.
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">National pipeline</p>
                <ul className="mt-3 space-y-2 text-sm text-emerald-200/80">
                  <li className="flex justify-between gap-6">
                    <span>Trees planted</span>
                    <span className="font-mono text-stone-50">{NATIONAL_METRICS.totalTreesPlanted.toLocaleString()}</span>
                  </li>
                  <li className="flex justify-between gap-6">
                    <span>Verified surviving</span>
                    <span className="font-mono text-stone-50">{NATIONAL_METRICS.verifiedSurviving.toLocaleString()}</span>
                  </li>
                  <li className="flex justify-between gap-6">
                    <span>Community earned</span>
                    <span className="font-mono text-stone-50">KSh {NATIONAL_METRICS.communityEarningsKsh.toLocaleString()}</span>
                  </li>
                  <li className="flex justify-between gap-6">
                    <span>Active projects</span>
                    <span className="font-mono text-stone-50">{NATIONAL_METRICS.activeProjects}</span>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Ecosystem principles</p>
                <ul className="mt-3 space-y-2 text-sm text-emerald-200/80">
                  {["Survival-based community incentives via M-Pesa", "Geotagged MRV at 3/6/12/24 months", "Impact separate from tradeable carbon credits", "Public ledgers on every Tree Impact Passport"].map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-8 border-t border-emerald-900/60 pt-4 text-xs text-emerald-300/50">
              © 2025 {BRAND_NAME} · Demo build with simulated data. Not investment advice — reforestation impact
              estimates are projections, not certified carbon offsets.
            </div>
          </div>
        </footer>

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#064e3b",
              color: "#f5f5f4",
              border: "1px solid rgba(217, 119, 6, 0.4)",
              borderRadius: "0.75rem",
            },
          }}
        />
      </div>
    </AppProvider>
  );
}