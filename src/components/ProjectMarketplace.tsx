import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Search,
  MapPin,
  Leaf,
  QrCode,
  ExternalLink,
  Check,
  ArrowUpRight,
  TreePine,
  HandCoins,
  Satellite,
  ShieldCheck,
  BadgeCheck,
  FlaskConical,
  Users,
  X,
  ReceiptText,
  Crosshair,
} from "lucide-react";
import type { Project } from "../types";
import { useApp } from "../context/AppContext";
import { SPECIES, CURRENCIES } from "../data/mockData";
import { cn } from "../lib/utils";

const LEGEND_KIND: Record<string, string> = {
  disbursement: "Disbursement",
  labor: "Community labor",
  materials: "Materials",
  mrv: "MRV services",
  incentive: "CFA incentive",
  verification: "Verification",
};

export function ProjectMarketplace() {
  const { state } = useApp();
  const prefersReducedMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [ecosystem, setEcosystem] = useState<string>("all");
  const [mrvFilter, setMrvFilter] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return state.projects.filter((p) => {
      const q = query.toLowerCase();
      const matchesQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.county.toLowerCase().includes(q) ||
        p.cfaName.toLowerCase().includes(q);
      const matchesEco = ecosystem === "all" || p.ecosystem === ecosystem;
      const matchesMrv = mrvFilter === "all" || p.mrvStage === mrvFilter;
      return matchesQ && matchesEco && matchesMrv;
    });
  }, [state.projects, query, ecosystem, mrvFilter]);

  const ecosystems = useMemo(
    () => Array.from(new Set(state.projects.map((p) => p.ecosystem))),
    [state.projects],
  );
  const mrvStages = useMemo(
    () => Array.from(new Set(state.projects.map((p) => p.mrvStage))),
    [state.projects],
  );

  const selected = state.projects.find((p) => p.id === selectedId) ?? null;
  const currency = CURRENCIES.find((c) => c.code === state.currency) ?? CURRENCIES[0];

  return (
    <section id="marketplace" className="scroll-mt-20 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-700">Climate finance marketplace</p>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-emerald-950 sm:text-4xl">
              Active reforestation projects
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-stone-600 sm:text-base">
              Fund verified Kenyan restoration. Open the Tree Impact Passport for the full public ledger, survival
              milestones and species mix.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-900/10 bg-white px-4 py-2.5 text-sm"
            >
              <HandCoins className="h-4 w-4 text-amber-600" />
              <span className="text-stone-500">Funded so far:</span>
              <span className="font-mono font-bold text-emerald-900">
                {state.projects.reduce((a, p) => a + p.fundedKsh, 0).toLocaleString()} KSh
              </span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-900/10 bg-white px-4 py-2.5 text-sm">
              <BadgeCheck className="h-4 w-4 text-emerald-600" />
              <span className="text-stone-500">
                {state.projects.filter((p) => p.verifiedSurvival).length}/{state.projects.length} verified
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search county, CFA, project…"
              className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-9 pr-3 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>
          <select
            value={ecosystem}
            onChange={(e) => setEcosystem(e.target.value)}
            className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-emerald-600"
          >
            <option value="all">All ecosystems</option>
            {ecosystems.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
          <select
            value={mrvFilter}
            onChange={(e) => setMrvFilter(e.target.value)}
            className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-emerald-600"
          >
            <option value="all">All MRV stages</option>
            {mrvStages.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Grid */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <motion.article
              key={p.id}
              layout
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: prefersReducedMotion ? 0 : i * 0.05 }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:shadow-lg"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={p.image}
                  alt={`${p.name} restoration site`}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-emerald-900">
                      <MapPin className="h-3 w-3" /> {p.county}
                    </span>
                    <h3 className="mt-1 text-lg font-bold leading-tight text-white">{p.name}</h3>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-bold",
                      p.verifiedSurvival ? "bg-emerald-400 text-emerald-950" : "bg-amber-400 text-amber-950",
                    )}
                  >
                    {p.mrvStage}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <p className="text-xs text-stone-500">
                  {p.ecosystem} · {p.hectares} ha · {p.averageTreeAgeMonths} mo avg age
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-stone-600">
                  <Users className="h-3.5 w-3.5 text-emerald-700" />
                  <span className="truncate">{p.cfaName}</span>
                </div>

                <div className="mt-3">
                  <div className="flex items-baseline justify-between text-xs text-stone-500">
                    <span>Funding · {Math.round((p.fundedKsh / p.targetKsh) * 100)}%</span>
                    <span className="font-mono text-emerald-800">
                      {Math.round(p.fundedKsh / 1_000_000)}M / {Math.round(p.targetKsh / 1_000_000)}M KSh
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-stone-100">
                    <motion.div
                      className="h-full rounded-full bg-emerald-600"
                      initial={false}
                      animate={{ width: `${Math.round((p.fundedKsh / p.targetKsh) * 100)}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-stone-50 p-2">
                    <p className="text-[10px] uppercase tracking-wide text-stone-400">Planted</p>
                    <p className="font-mono text-sm font-bold text-emerald-950">{p.plantedTrees.toLocaleString()}</p>
                  </div>
                  <div className="rounded-lg bg-emerald-50 p-2">
                    <p className="text-[10px] uppercase tracking-wide text-emerald-600">Survival</p>
                    <p className="font-mono text-sm font-bold text-emerald-900">{Math.round(p.survivalRate * 100)}%</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-1.5">
                  {p.speciesMix.map((sm) => {
                    const sp = SPECIES.find((s) => s.id === sm.speciesId);
                    return (
                      <span
                        key={sm.speciesId}
                        className="flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[11px] text-amber-800"
                        title={`${sp?.name ?? sm.speciesId} ${sm.pct}%`}
                      >
                        {sp?.emoji} {sp?.name.split(" ")[0] ?? sm.speciesId} {sm.pct}%
                      </span>
                    );
                  })}
                </div>

                <button
                  onClick={() => setSelectedId(p.id)}
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-stone-50 transition hover:bg-emerald-700 active:scale-[0.99]"
                >
                  Open Tree Impact Passport
                  <QrCode className="h-4 w-4" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
            <Search className="mx-auto h-8 w-8 text-stone-300" />
            <p className="mt-3 font-semibold text-stone-600">No projects match your filters</p>
            <p className="text-sm text-stone-400">Try clearing the search or selecting another ecosystem.</p>
          </div>
        )}
      </div>

      {/* Passport modal */}
      <AnimatePresence>
        {selected && (
          <ProjectPassport
            project={selected}
            currencySymbol={currency.symbol}
            onClose={() => setSelectedId(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function ProjectPassport({
  project,
  currencySymbol,
  onClose,
}: {
  project: Project;
  currencySymbol: string;
  onClose: () => void;
}) {
  const { state, setRole } = useApp();
  const prefersReducedMotion = useReducedMotion();
  const [tab, setTab] = useState<"ledger" | "milestones" | "species" | "compliance">("ledger");

  const fundPct = Math.round((project.fundedKsh / project.targetKsh) * 100);
  const gapKsh = Math.max(0, project.targetKsh - project.fundedKsh);
  const cfa = state.cfas.find((c) => c.id === project.cfaId);

  const openDonateTab = () => {
    onClose();
    setRole("donor");
    document.getElementById("impact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-emerald-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={prefersReducedMotion ? undefined : { y: 48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={prefersReducedMotion ? undefined : { y: 48, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.15, duration: 0.55 }}
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-stone-50 shadow-2xl sm:rounded-3xl"
      >
        {/* Header */}
        <div className="relative h-52 overflow-hidden rounded-t-3xl">
          <img src={project.image} alt={project.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/30" />
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-emerald-950 hover:bg-white"
            aria-label="Close passport"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-200">
              <span className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 backdrop-blur">
                <MapPin className="h-3 w-3" /> {project.county}, {project.region}
              </span>
              <span className="rounded-full bg-amber-400/90 px-2 py-0.5 text-amber-950">{project.mrvStage}</span>
              {project.verifiedSurvival && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-400/90 px-2 py-0.5 text-emerald-950">
                  <BadgeCheck className="h-3 w-3" /> Verified
                </span>
              )}
            </div>
            <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{project.name}</h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-emerald-100">
              <Users className="h-4 w-4" /> {project.cfaName}
            </p>
          </div>
        </div>

        {/* Funding bar */}
        <div className="border-b border-stone-200 bg-white px-4 py-4 sm:px-6">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">Funded</p>
              <p className="font-mono text-lg font-bold text-emerald-950">KSh {project.fundedKsh.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">Target</p>
              <p className="font-mono text-lg font-bold text-stone-700">KSh {project.targetKsh.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">Funding gap</p>
              <p className="font-mono text-lg font-bold text-amber-600">{gapKsh.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-stone-100">
            <motion.div
              className="h-full rounded-full bg-emerald-600"
              initial={false}
              animate={{ width: `${fundPct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={openDonateTab}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-emerald-950 transition hover:bg-amber-400 active:scale-[0.99]"
            >
              <HandCoins className="h-4 w-4" /> Fund this project
            </button>
            <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-900/15 bg-stone-50 px-4 py-2.5">
              <QrCode className="h-5 w-5 text-emerald-800" />
              <div className="text-xs leading-tight text-stone-500">
                <p className="font-semibold text-emerald-950">Passport QR</p>
                {"›"} mmiti.ke/passport/{project.id}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto border-b border-stone-200 bg-white px-3 pt-2 sm:px-5">
          {[
            { id: "ledger" as const, label: "Transparent ledger", icon: ReceiptText },
            { id: "milestones" as const, label: "Milestones", icon: Crosshair },
            { id: "species" as const, label: "Species mix", icon: FlaskConical },
            { id: "compliance" as const, label: "Compliance", icon: ShieldCheck },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-semibold transition",
                  tab === t.id
                    ? "border-emerald-700 text-emerald-900"
                    : "border-transparent text-stone-400 hover:text-stone-600",
                )}
              >
                <Icon className="h-4 w-4" /> {t.label}
              </button>
            );
          })}
        </div>

        <div className="px-4 py-4 sm:px-6 sm:py-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={prefersReducedMotion ? undefined : { opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
            >
              {tab === "ledger" && (
                <div>
                  <p className="text-sm leading-relaxed text-stone-600">{project.recoveryDetail}</p>
                  <div className="mt-4 overflow-hidden rounded-xl border border-stone-200">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-emerald-950 text-[11px] uppercase tracking-wider text-emerald-200">
                        <tr>
                          <th className="px-3 py-2.5">Date</th>
                          <th className="px-3 py-2.5">Category</th>
                          <th className="px-3 py-2.5">Payee</th>
                          <th className="px-3 py-2.5 text-right">Amount (KSh)</th>
                          <th className="px-3 py-2.5 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {project.ledger.map((l) => (
                          <tr key={l.id} className="bg-white">
                            <td className="whitespace-nowrap px-3 py-2.5 font-mono text-xs text-stone-500">{l.date}</td>
                            <td className="px-3 py-2.5">
                              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                                {LEGEND_KIND[l.kind] ?? l.kind}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-xs text-stone-600">
                              {l.payee}
                              <p className="text-[10px] text-stone-400">{l.description}</p>
                            </td>
                            <td className="whitespace-nowrap px-3 py-2.5 text-right font-mono text-xs font-bold text-emerald-950">
                              {l.amountKsh.toLocaleString()}
                            </td>
                            <td className="px-3 py-2.5 text-right">
                              {l.verified ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                                  <Check className="h-3 w-3" /> verified
                                </span>
                              ) : (
                                <span className="text-[11px] font-bold text-amber-600">pending</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {tab === "milestones" && (
                <div>
                  <div className="relative ml-2 border-l-2 border-emerald-200 pl-5">
                    {project.milestones.map((m) => (
                      <div key={m.id} className="relative pb-5 last:pb-0">
                        <span
                          className={cn(
                            "absolute -left-[27px] flex h-5 w-5 items-center justify-center rounded-full border-2",
                            m.complete ? "border-emerald-600 bg-emerald-600 text-white" : "border-stone-300 bg-white text-stone-300",
                          )}
                        >
                          {m.complete && <Check className="h-3 w-3" />}
                        </span>
                        <p className="text-sm font-bold text-emerald-950">
                          {m.label}
                          <span className="ml-2 font-mono text-xs font-normal text-stone-400">{m.date}</span>
                        </p>
                        <p className="text-xs text-stone-500">{m.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === "species" && (
                <div>
                  <div className="rounded-xl border border-stone-200 bg-white p-4">
                    <p className="text-sm font-bold text-emerald-950">Recommended species mix</p>
                    <p className="text-xs text-stone-500">
                      AI-assisted biodiversity score: <span className="font-mono font-bold text-emerald-800">{project.biodiversityScore}/100</span>
                    </p>
                    <div className="mt-3 space-y-3">
                      {project.speciesMix.map((sm) => {
                        const sp = SPECIES.find((s) => s.id === sm.speciesId);
                        if (!sp) return null;
                        return (
                          <div key={sm.speciesId}>
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-semibold text-stone-700">
                                {sp.emoji} {sp.name} <span className="font-normal italic text-stone-400">{sp.latin}</span>
                              </span>
                              <span className="font-mono text-xs font-bold text-emerald-800">{sm.pct}%</span>
                            </div>
                            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-stone-100">
                              <div className="h-full rounded-full bg-amber-400" style={{ width: `${sm.pct}%` }} />
                            </div>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {sp.uses.map((u) => (
                                <span key={u} className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] text-stone-500">
                                  {u}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <p className="mt-4 border-t border-stone-100 pt-3 text-xs text-stone-400">
                      Mix optimized for ecological fit, water regime and community livelihood value—not monoculture timber.
                    </p>
                  </div>
                </div>
              )}

              {tab === "compliance" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {state.regulations.map((r) => (
                    <div key={r.id} className={cn("rounded-xl border p-4", r.status === "Approved" ? "border-emerald-200 bg-emerald-50" : "border-stone-200 bg-white")}>
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-bold text-emerald-950">{r.title}</p>
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
                      <p className="mt-1 text-xs text-stone-500">
                        {r.authority} · due {r.dueDate}
                      </p>
                      <p className="mt-1.5 text-xs text-stone-600">{r.description}</p>
                    </div>
                  ))}
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
                    <div className="flex items-center gap-1.5 font-bold">
                      <QrCode className="h-4 w-4" /> Compliance QR badge
                    </div>
                    <p className="mt-1">
                      Scan to audit this project's permits, consent deeds and benefit-sharing agreements. Updates are
                      logged by admins in the Regulatory Console.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}