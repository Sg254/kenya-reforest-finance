import { useMemo, useState, useEffect } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import {
  TreePine,
  Sprout,
  HandCoins,
  Leaf,
  Recycle,
  PiggyBank,
  FlaskConical,
  QrCode,
  Satellite,
  ArrowUpRight,
  Sparkle,
  Users,
  ShieldCheck,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { CO2_PER_TREE_PER_YEAR, IMAGES, SPECIES, CURRENCIES, NATIONAL_METRICS } from "../data/mockData";
import { cn } from "../lib/utils";

const fmtKsh = (n: number) => `KSh ${Math.round(n).toLocaleString()}`;

export function LandingCalculator() {
  const { state } = useApp();
  const prefersReducedMotion = useReducedMotion();
  const [amount, setAmount] = useState(100000);
  const [trees, setTrees] = useState(400);
  const [activeInput, setActiveInput] = useState<"cash" | "trees">("cash");
  const [horizon, setHorizon] = useState(10);
  const [speciesMatch, setSpeciesMatch] = useState("podocarpus");

  const kshPerTree = 250;
  const currency = CURRENCIES.find((c) => c.code === state.currency) ?? CURRENCIES[0];
  const effectiveAmount = activeInput === "cash" ? amount : trees * kshPerTree;
  const effectiveTrees = activeInput === "trees" ? trees : Math.floor(amount / kshPerTree);

  const allocation = [
    { label: "Seedlings & nursery", pct: state.allocation.seedlings, color: "bg-emerald-600" },
    { label: "CFA maintenance", pct: state.allocation.cfaMaintenance, color: "bg-emerald-400" },
    { label: "MRV technology", pct: state.allocation.mrvTech, color: "bg-amber-500" },
    { label: "Community direct incentives", pct: state.allocation.communityIncentives, color: "bg-amber-300" },
  ];

  const co2 = useMemo(
    () => effectiveTrees * CO2_PER_TREE_PER_YEAR * horizon,
    [effectiveTrees, horizon],
  );
  const communityReward = effectiveTrees * 0.2 * (0.86 * horizon) * kshPerTree * 0.08; // simplified reward model
  const species = SPECIES.find((s) => s.id === speciesMatch) ?? SPECIES[1];

  const presets = [25000, 100000, 500000, 1000000];

  return (
    <div className="bg-stone-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-emerald-950">
        <motion.img
          src={IMAGES.hero}
          alt="Reforestation terraces on the slopes of Mount Kenya"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/70 via-emerald-950/50 to-emerald-950" />
        <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 sm:pt-20 sm:pb-12">
          <div className="max-w-2xl">
            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-300"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified community reforestation
            </motion.div>
            <motion.h1
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="mt-4 text-4xl font-extrabold leading-none tracking-tighter text-stone-50 sm:text-6xl"
            >
              Every tree, <span className="text-amber-400">verified</span> to village level.
            </motion.h1>
            <motion.p
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="mt-4 max-w-xl text-base leading-relaxed text-emerald-100/90 sm:text-lg"
            >
              M-Miti connects corporate donors with Kenyan forest communities through a transparent pipeline. See exactly where your KSh goes, who plants, and how survival is proven.
            </motion.p>
            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="mt-6 flex flex-wrap items-center gap-3"
            >
              <button
                onClick={() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })}
                className="rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-emerald-950 shadow-lg shadow-amber-500/20 transition active:scale-[0.98] hover:bg-amber-400"
              >
                Calculate your impact
              </button>
              <button
                onClick={() => document.getElementById("marketplace")?.scrollIntoView({ behavior: "smooth" })}
                className="rounded-xl border border-emerald-400/30 px-5 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-900/50 active:scale-[0.98]"
              >
                Explore projects
              </button>
            </motion.div>
          </div>

          {/* National stats */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 md:grid-cols-4"
          >
            {[
              { icon: TreePine, label: "Trees planted", value: NATIONAL_METRICS.totalTreesPlanted.toLocaleString(), sub: "across 5 active projects" },
              { icon: Leaf, label: "Verified survival", value: `${Math.round(NATIONAL_METRICS.verifiedSurviving).toLocaleString()}`, sub: "geotagged MRV proof" },
              { icon: Recycle, label: "CO₂e sequestered (20y)", value: `${NATIONAL_METRICS.totalCO2eSequestred20yr.toLocaleString()} t`, sub: "tree impact, separate from carbon credits" },
              { icon: HandCoins, label: "Community earnings", value: fmtKsh(NATIONAL_METRICS.communityEarningsKsh), sub: "paid to CFA wallets" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="rounded-2xl border border-emerald-400/15 bg-emerald-900/40 p-4 backdrop-blur-sm">
                  <Icon className="h-5 w-5 text-amber-400" strokeWidth={2} />
                  <p className="mt-2 font-mono text-lg font-bold text-stone-50 sm:text-xl">{s.value}</p>
                  <p className="text-xs text-emerald-200/80">{s.label}</p>
                  <p className="mt-0.5 text-[11px] text-emerald-200/50">{s.sub}</p>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-700">Interactive impact calculator</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-emerald-950 sm:text-4xl">
              From KSh to seedlings, labor and carbon
            </h2>
            <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-stone-600">
              Pick a donation or a tree count. M-Miti converts it into a transparent breakdown: community rewards, seedlings, transport, planting labor, and projected CO₂e over 5, 10 or 20 years.
            </p>

            {/* Currency toggle */}
            <div className="mt-6 flex items-center gap-2">
              {presets.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setActiveInput("cash");
                    setAmount(p);
                  }}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition",
                    activeInput === "cash" && amount === p
                      ? "border-emerald-700 bg-emerald-800 text-stone-50"
                      : "border-emerald-900/15 bg-white text-emerald-900 hover:border-emerald-600",
                  )}
                >
                  {p >= 1000000 ? `${p / 1000000}M` : p >= 1000 ? `${p / 1000}K` : p}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                onClick={() => setActiveInput("cash")}
                className={cn(
                  "rounded-xl border-2 p-4 text-left transition",
                  activeInput === "cash" ? "border-emerald-700 bg-emerald-50" : "border-stone-200 bg-white hover:border-emerald-300",
                )}
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">Cash donation</span>
                <div className="mt-1 flex items-center gap-1 font-mono text-2xl font-bold text-emerald-950">
                  <span className="text-amber-600">{currency.symbol}</span>
                  <input
                    type="number"
                    min={0}
                    value={activeInput === "cash" ? amount : Math.round(effectiveAmount)}
                    onChange={(e) => {
                      setActiveInput("cash");
                      setAmount(Math.max(0, Number(e.target.value) || 0));
                    }}
                    className="w-full bg-transparent outline-none"
                    inputMode="numeric"
                  />
                </div>
              </button>
              <button
                onClick={() => setActiveInput("trees")}
                className={cn(
                  "rounded-xl border-2 p-4 text-left transition",
                  activeInput === "trees" ? "border-emerald-700 bg-emerald-50" : "border-stone-200 bg-white hover:border-emerald-300",
                )}
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">Trees</span>
                <div className="mt-1 flex items-center gap-1 font-mono text-2xl font-bold text-emerald-950">
                  <TreePine className="h-6 w-6 text-emerald-700" strokeWidth={2} />
                  <input
                    type="number"
                    min={0}
                    value={activeInput === "trees" ? trees : effectiveTrees}
                    onChange={(e) => {
                      setActiveInput("trees");
                      setTrees(Math.max(0, Number(e.target.value) || 0));
                    }}
                    className="w-full bg-transparent outline-none"
                    inputMode="numeric"
                  />
                </div>
              </button>
            </div>

            {/* Horizon slider */}
            <div className="mt-4 rounded-xl border border-stone-200 bg-white p-4">
              <div className="flex items-center justify-between text-sm font-medium text-stone-600">
                <span>Sequestration horizon</span>
                <span className="font-mono text-emerald-800">{horizon} years</span>
              </div>
              <input
                type="range"
                min={5}
                max={20}
                step={5}
                value={horizon}
                onChange={(e) => setHorizon(Number(e.target.value))}
                className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-emerald-100 accent-emerald-700"
              />
              <div className="mt-1 flex justify-between font-mono text-xs text-stone-400">
                <span>5y</span>
                <span>10y</span>
                <span>15y</span>
                <span>20y</span>
              </div>
            </div>

            {/* Spirit of allocation */}
            <div className="mt-4 rounded-xl border border-stone-200 bg-white p-4">
              <p className="text-sm font-semibold text-emerald-950">Where your KSh goes</p>
              <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full">
                {allocation.map((a) => (
                  <div key={a.label} className={a.color} style={{ width: `${a.pct}%` }} />
                ))}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {allocation.map((a) => (
                  <div key={a.label} className="flex items-center gap-2 text-xs text-stone-600">
                    <span className={cn("h-2.5 w-2.5 rounded-sm", a.color)} />
                    {a.label}
                    <span className="ml-auto font-mono font-semibold text-emerald-900">{a.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results panel */}
          <div>
            <div className="rounded-2xl border border-emerald-900/10 bg-emerald-950 p-6 text-stone-100 shadow-xl">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Projected impact</p>
                <span className="flex items-center gap-1 rounded-full bg-emerald-900 px-2 py-0.5 text-[11px] text-emerald-300">
                  <FlaskConical className="h-3 w-3" /> model v2
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-emerald-900/60 p-4">
                  <div className="flex items-center gap-1.5 text-emerald-300">
                    <TreePine className="h-4 w-4" />
                    <span className="text-[11px] font-medium uppercase tracking-wide">Trees</span>
                  </div>
                  <p className="mt-1 font-mono text-3xl font-bold text-white">{effectiveTrees.toLocaleString()}</p>
                  <p className="text-[11px] text-emerald-300/70">indigenous seedlings</p>
                </div>
                <div className="rounded-xl bg-emerald-900/60 p-4">
                  <div className="flex items-center gap-1.5 text-emerald-300">
                    <Leaf className="h-4 w-4" />
                    <span className="text-[11px] font-medium uppercase tracking-wide">CO₂e (t)</span>
                  </div>
                  <p className="mt-1 font-mono text-3xl font-bold text-white">{co2.toLocaleString(undefined, { maximumFractionDigits: 1 })}</p>
                  <p className="text-[11px] text-emerald-300/70">over {horizon} years</p>
                </div>
                <div className="rounded-xl bg-emerald-900/60 p-4">
                  <div className="flex items-center gap-1.5 text-emerald-300">
                    <PiggyBank className="h-4 w-4" />
                    <span className="text-[11px] font-medium uppercase tracking-wide">Community rewards</span>
                  </div>
                  <p className="mt-1 font-mono text-3xl font-bold text-amber-400">{fmtKsh(communityReward)}</p>
                  <p className="text-[11px] text-emerald-300/70">survival-linked, paid to CFA</p>
                </div>
                <div className="rounded-xl bg-emerald-900/60 p-4">
                  <div className="flex items-center gap-1.5 text-emerald-300">
                    <Sprout className="h-4 w-4" />
                    <span className="text-[11px] font-medium uppercase tracking-wide">Seedlings</span>
                  </div>
                  <p className="mt-1 font-mono text-3xl font-bold text-white">{Math.round(effectiveTrees * 1.12).toLocaleString()}</p>
                  <p className="text-[11px] text-emerald-300/70">incl. 12% nursery buffer</p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-emerald-800 bg-emerald-900/40 p-4">
                <p className="text-xs font-semibold text-emerald-200">Breakdown per tree ({fmtKsh(kshPerTree)})</p>
                <div className="mt-2 space-y-1.5 text-sm">
                  {[
                    { label: "Seedling & nursery polybag", v: 90 },
                    { label: "Transport to planting site", v: 45 },
                    { label: "Planting labor (community)", v: 70 },
                    { label: "MRV & verification", v: 45 },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center justify-between">
                      <span className="text-emerald-200/80">{r.label}</span>
                      <span className="font-mono text-emerald-100">{fmtKsh(r.v)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200/90">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <p>
                  Tree planting impact is tracked separately from tradeable carbon credits. This estimate is a
                  planning projection and not a certified carbon claim.
                </p>
              </div>
            </div>

            {/* Species matcher */}
            <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-5">
              <div className="flex items-center gap-2">
                <Sparkle className="h-4 w-4 text-amber-600" strokeWidth={2} />
                <p className="text-sm font-bold text-emerald-950">AI species matcher</p>
              </div>
              <p className="mt-1 text-xs text-stone-500">
                Best-fit indigenous species for {effectiveTrees.toLocaleString()} trees in the selected county.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {SPECIES.slice(0, 6).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSpeciesMatch(s.id)}
                    className={cn(
                      "rounded-lg border px-2.5 py-1.5 text-xs font-medium transition",
                      speciesMatch === s.id
                        ? "border-emerald-700 bg-emerald-800 text-stone-50"
                        : "border-stone-200 bg-stone-50 text-stone-600 hover:border-emerald-400",
                    )}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-2xl">
                  {species.emoji}
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-950">{species.name}</p>
                  <p className="text-xs text-stone-500">
                    {species.latin} · {species.type} · water: {species.waterRequirement}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="font-mono text-sm font-bold text-emerald-800">{Math.round(species.survivalBias * 100)}%</p>
                  <p className="text-[10px] text-stone-400">survival rate</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {species.uses.map((u) => (
                  <span key={u} className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                    {u}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works / QR passport teaser */}
      <section className="border-y border-emerald-900/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: QrCode, title: "Tree Impact Passport", desc: "Every project gets a public QR passport with a transparent financial ledger and verified survival milestones." },
              { icon: Satellite, title: "MRV-backed proof", desc: "Field officers log geotagged surveys at 3, 6, 12 and 24 months. Survival rates are locked on-chain of record." },
              { icon: Users, title: "Community-first payout", desc: "CFAs earn survival bonuses paid via M-Pesa. Incentives scale with verified survival, not headcount." },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group rounded-2xl border border-stone-200 bg-stone-50 p-6 transition hover:-translate-y-1 hover:bg-emerald-50"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-800 text-stone-50 transition group-hover:bg-amber-500 group-hover:text-emerald-950">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-emerald-950">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{f.desc}</p>
                  <button
                    onClick={() => document.getElementById("marketplace")?.scrollIntoView({ behavior: "smooth" })}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-amber-600"
                  >
                    Explore <ArrowUpRight className="h-4 w-4" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community strip */}
      <section className="bg-emerald-950">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 md:py-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Built with communities</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-stone-50">
              {NATIONAL_METRICS.cfaMembersInvolved.toLocaleString()} CFA members on the ground
            </h2>
            <p className="mt-3 max-w-[55ch] text-base leading-relaxed text-emerald-100/80">
              Kangaita, Aberdare Guardians, Mau Narok Stewards and more run nurseries, plant and report survival.
              Every payout is public in the project ledger.
            </p>
            <div className="mt-4 flex items-center gap-3 text-sm text-emerald-200">
              <Users className="h-4 w-4 text-amber-400" />
              <span>5 CFAs · 4 counties · {NATIONAL_METRICS.activeProjects} active projects</span>
            </div>
          </div>
          <motion.img
            src={IMAGES.community}
            alt="Community members potting indigenous seedlings at a CFA nursery"
            className="aspect-[4/3] w-full rounded-2xl object-cover"
            initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </section>
    </div>
  );
}

export { fmtKsh };