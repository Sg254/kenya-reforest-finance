import { useState } from "react";
import { Check, HandCoins, ShieldCheck, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { cn } from "../lib/utils";

export function AdminConsole() {
  const { state, setAllocation, updateRegulation } = useApp();
  const [seedlings, setSeedlings] = useState(state.allocation.seedlings);
  const [cfaMaintenance, setCfaMaintenance] = useState(state.allocation.cfaMaintenance);
  const [mrvTech, setMrvTech] = useState(state.allocation.mrvTech);
  const [communityIncentives, setCommunityIncentives] = useState(state.allocation.communityIncentives);
  const [saved, setSaved] = useState(false);

  const totalPct = seedlings + cfaMaintenance + mrvTech + communityIncentives;
  const allocationValid = totalPct === 100;

  const saveAllocation = () => {
    setAllocation({ id: "custom", name: "Custom allocation", seedlings, cfaMaintenance, mrvTech, communityIncentives });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Budget allocation */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6">
        <div className="flex items-center gap-2">
          <HandCoins className="h-5 w-5 text-emerald-700" />
          <p className="font-bold text-emerald-950">Dynamic budget allocation</p>
        </div>
        <p className="mt-1 text-xs text-stone-500">Decide how each donated KSh is split. Must total exactly 100%.</p>

        <div className="mt-5 space-y-4">
          {[
            { label: "Seedlings & nursery", pct: seedlings, set: setSeedlings },
            { label: "CFA maintenance", pct: cfaMaintenance, set: setCfaMaintenance },
            { label: "MRV technology", pct: mrvTech, set: setMrvTech },
            { label: "Community direct incentives", pct: communityIncentives, set: setCommunityIncentives },
          ].map((row) => (
            <div key={row.label}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-stone-700">{row.label}</span>
                <span className={cn("font-mono font-bold", row.pct > 0 ? "text-emerald-900" : "text-stone-400")}>
                  {row.pct}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={row.pct}
                onChange={(e) => row.set(Number(e.target.value))}
                className="mt-1.5 h-2 w-full cursor-pointer appearance-none rounded-full bg-stone-100 accent-emerald-700"
              />
            </div>
          ))}
        </div>

        <div
          className={cn(
            "mt-4 flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold",
            allocationValid ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700",
          )}
        >
          <span>{allocationValid ? "Allocation locked at 100%" : `Allocation sums to ${totalPct}%`}</span>
          {allocationValid ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </div>

        <button
          onClick={saveAllocation}
          disabled={!allocationValid}
          className="mt-3 w-full rounded-xl bg-emerald-800 py-3 text-sm font-bold text-stone-50 hover:bg-emerald-700 disabled:opacity-40"
        >
          {saved ? "Saved ✓ — live on landing calculator" : "Save allocation"}
        </button>

        <div className="mt-4">
          <p className="text-xs font-semibold text-stone-500">Presets</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {[
              { id: "national-2025", name: "National default", v: { seedlings: 38, cfaMaintenance: 27, mrvTech: 15, communityIncentives: 20 } },
              { id: "mangrove-blue-carbon", name: "Mangrove blue carbon", v: { seedlings: 42, cfaMaintenance: 24, mrvTech: 18, communityIncentives: 16 } },
              { id: "water-tower-priority", name: "Water tower", v: { seedlings: 30, cfaMaintenance: 30, mrvTech: 20, communityIncentives: 20 } },
            ].map((pr) => (
              <button
                key={pr.id}
                onClick={() => {
                  setSeedlings(pr.v.seedlings);
                  setCfaMaintenance(pr.v.cfaMaintenance);
                  setMrvTech(pr.v.mrvTech);
                  setCommunityIncentives(pr.v.communityIncentives);
                  setAllocation({ id: pr.id, name: pr.name, ...pr.v });
                }}
                className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 hover:border-emerald-500 hover:text-emerald-800"
              >
                {pr.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Regulatory checklist */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-700" />
          <p className="font-bold text-emerald-950">Kenya regulatory checklist</p>
        </div>
        <p className="mt-1 text-xs text-stone-500">Permits, consents and audits required before trees are verified.</p>

        <div className="mt-4 space-y-3">
          {state.regulations.map((r) => (
            <div key={r.id} className="rounded-xl border border-stone-100 bg-stone-50/60 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-emerald-950">{r.title}</p>
                  <p className="text-[11px] text-stone-400">{r.authority} · due {r.dueDate}</p>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                    r.status === "Approved" && "bg-emerald-600 text-white",
                    r.status === "In Review" && "bg-sky-100 text-sky-800",
                    r.status === "Missing" && "bg-red-100 text-red-700",
                    r.status === "Expiring" && "bg-amber-100 text-amber-800",
                  )}
                >
                  {r.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-stone-500">{r.description}</p>
              <div className="mt-2 flex gap-1.5">
                {(["Approved", "In Review", "Missing", "Expiring"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => updateRegulation(r.id, st)}
                    className={cn(
                      "rounded-lg px-2 py-1 text-[10px] font-bold uppercase transition",
                      r.status === st ? "bg-emerald-800 text-white" : "bg-white text-stone-400 hover:bg-stone-100",
                    )}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}