import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Check,
  Download,
  LayoutDashboard,
  Leaf,
  Plus,
  QrCode,
  Wallet,
  X,
  PiggyBank,
  Smartphone,
  ClipboardList,
  ShieldCheck,
} from "lucide-react";
import type { CFAGroup, DonorContribution } from "../types";
import { useApp } from "../context/AppContext";
import { IMAGES, SPECIES } from "../data/mockData";
import { cn } from "../lib/utils";
import { FieldMRV } from "./FieldMRV";
import { AdminConsole } from "./AdminConsole";

const fmtKsh = (n: number) => `KSh ${Math.round(n).toLocaleString()}`;

export function PortalsAndMRV() {
  const { state, resetState } = useApp();
  const [portal, setPortal] = useState<"donor" | "cfa" | "field" | "admin">(
    state.role === "public" ? "donor" : (state.role as "donor" | "cfa" | "field" | "admin"),
  );

  const tabs = [
    { id: "donor", label: "Donor Impact Hub", icon: LayoutDashboard },
    { id: "cfa", label: "Community Wallet", icon: Wallet },
    { id: "field", label: "Field MRV", icon: ClipboardList },
    { id: "admin", label: "Admin Console", icon: ShieldCheck },
  ] as const;

  const activePortal = state.role === "public" ? portal : (state.role as "donor" | "cfa" | "field" | "admin");

  return (
    <section id="impact" className="scroll-mt-20 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-700">Role-based portals</p>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-emerald-950 sm:text-4xl">
              Donor, community and field operations
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-stone-600 sm:text-base">
              Switch roles to see the verified pipeline from every seat: corporate donor, CFA leader, field officer
              or platform admin.
            </p>
          </div>
          <button
            onClick={() => resetState()}
            className="rounded-xl border border-stone-300 px-3 py-2 text-xs font-medium text-stone-500 hover:border-red-300 hover:text-red-600"
            title="Restore seed data"
          >
            Reset demo data
          </button>
        </div>

        <div className="mt-6 flex gap-1.5 overflow-x-auto rounded-2xl border border-stone-200 bg-white p-1.5">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setPortal(t.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition",
                  activePortal === t.id ? "bg-emerald-800 text-stone-50 shadow-sm" : "text-stone-500 hover:bg-emerald-50 hover:text-emerald-900",
                )}
              >
                <Icon className="h-4 w-4" /> {t.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePortal}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {activePortal === "donor" && <DonorHub />}
              {activePortal === "cfa" && <CfaWallet />}
              {activePortal === "field" && <FieldMRV />}
              {activePortal === "admin" && <AdminConsole />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Donor & Corporate Impact Hub ---------------- */
function DonorHub() {
  const { state } = useApp();
  const [certProjectId, setCertProjectId] = useState<string | null>(null);
  const [showDeposit, setShowDeposit] = useState(false);

  const myContributions = state.contributions;
  const totalGiven = myContributions.reduce((a, c) => a + c.amountKsh + c.inKindKshEquivalent, 0);
  const totalSurviving = myContributions.reduce((a, c) => a + c.verifiedSurviving, 0);
  const avgSurvival = totalSurviving / Math.max(1, myContributions.reduce((a, c) => a + c.treesAttributed, 0));

  const certProject = state.projects.find((p) => p.id === certProjectId) ?? null;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-1">
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-emerald-700" />
            <p className="font-bold text-emerald-950">Corporate ESG portfolio</p>
          </div>
          <p className="mt-3 font-mono text-3xl font-extrabold text-emerald-950">{fmtKsh(totalGiven)}</p>
          <p className="text-xs text-stone-500">total committed (cash + in-kind value)</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-emerald-50 p-3">
              <p className="font-mono text-xl font-bold text-emerald-900">
                {myContributions.reduce((a, c) => a + c.treesAttributed, 0).toLocaleString()}
              </p>
              <p className="text-[11px] text-emerald-700">trees attributed</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3">
              <p className="font-mono text-xl font-bold text-amber-800">{Math.round(avgSurvival * 100)}%</p>
              <p className="text-[11px] text-amber-700">verified survival</p>
            </div>
          </div>
          <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 text-xs text-emerald-800">
            <span className="font-bold">Verification note:</span> your tree impact runs through geotagged MRV, separate
            from any tradeable carbon credit ledger.
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <img src={IMAGES.fieldOfficer} alt="Field officer surveying planted trees" className="h-32 w-full rounded-xl object-cover" />
          <p className="mt-3 text-sm font-bold text-emerald-950">Your impact pipeline</p>
          <p className="text-xs text-stone-500">Contributions → planted batches → surveys at 3/6/12/24 months → verified survival → certificates.</p>
          <div className="mt-3 space-y-2">
            {["Seedling intake", "Planting proof", "Survival audit", "Certificate"].map((s, i, arr) => (
              <div key={s} className="flex items-center gap-2 text-xs">
                <span className={cn("flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold", i === arr.length - 1 ? "bg-amber-400 text-amber-950" : "bg-emerald-600 text-white")}>
                  {i === arr.length - 1 ? "✓" : i + 1}
                </span>
                <span className={i === arr.length - 1 ? "font-bold text-emerald-900" : "text-stone-600"}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-bold text-emerald-950">Contribution ledger</p>
              <p className="text-xs text-stone-500">All cash and in-kind contributions with verified attribution</p>
            </div>
            <button
              onClick={() => setShowDeposit(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-800 px-3.5 py-2 text-sm font-semibold text-stone-50 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" /> New contribution
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-stone-400">
                <tr className="border-b border-stone-100">
                  <th className="pb-2">Donor</th>
                  <th className="pb-2">Project</th>
                  <th className="pb-2">Kind</th>
                  <th className="pb-2 text-right">Amount</th>
                  <th className="pb-2 text-right">Trees</th>
                  <th className="pb-2 text-right">Surviving</th>
                  <th className="pb-2 text-right">Certificate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {myContributions.map((c) => {
                  const proj = state.projects.find((p) => p.id === c.projectId);
                  return (
                    <tr key={c.id}>
                      <td className="py-2.5 font-medium text-stone-800">{c.donor}</td>
                      <td className="py-2.5 text-xs text-stone-500">{proj?.name ?? c.projectId}</td>
                      <td className="py-2.5">
                        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", c.kind === "cash" ? "bg-emerald-100 text-emerald-800" : "bg-sky-100 text-sky-800")}>
                          {c.kind === "cash" ? "cash" : "in-kind"}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-mono text-xs font-semibold text-emerald-950">
                        {fmtKsh(c.amountKsh || c.inKindKshEquivalent)}
                      </td>
                      <td className="py-2.5 text-right font-mono text-xs">{c.treesAttributed.toLocaleString()}</td>
                      <td className="py-2.5 text-right font-mono text-xs font-bold text-emerald-700">{c.verifiedSurviving.toLocaleString()}</td>
                      <td className="py-2.5 text-right">
                        {c.certificateIssued ? (
                          <button
                            onClick={() => setCertProjectId(c.projectId)}
                            className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-2 py-1 text-[11px] font-bold text-amber-800 hover:bg-amber-200"
                          >
                            <Award className="h-3 w-3" /> View
                          </button>
                        ) : (
                          <span className="text-[11px] text-stone-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {myContributions.length === 0 && (
            <p className="mt-4 rounded-xl bg-stone-50 p-4 text-center text-sm text-stone-500">
              No contributions yet. Add your first impact investment.
            </p>
          )}
        </div>

        <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-5">
          <p className="font-bold text-emerald-950">Dynamic ESG snapshot</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {[
              { label: "tCO₂e sequestered (20y)", value: `${Math.round(totalSurviving * 0.44).toLocaleString()} t` },
              { label: "Community jobs supported", value: `${Math.round(totalSurviving / 850).toLocaleString()}` },
              { label: "CFA earnings unlocked", value: fmtKsh(Math.round(totalSurviving * 0.22)) },
            ].map((m) => (
              <div key={m.label} className="rounded-xl bg-stone-50 p-3">
                <p className="font-mono text-lg font-bold text-emerald-950">{m.value}</p>
                <p className="text-[11px] text-stone-500">{m.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-stone-400">
            Estimates use project-level survival-weighted sequestration. Planting impact ≠ certified carbon credits.
          </p>
        </div>
      </div>

      <AnimatePresence>
        {showDeposit && <DonationModal onClose={() => setShowDeposit(false)} />}
        {certProject && <CertificateModal projectId={certProject.id} projectName={certProject.name} cfaName={certProject.cfaName} onClose={() => setCertProjectId(null)} />}
      </AnimatePresence>
    </div>
  );
}

function DonationModal({ onClose }: { onClose: () => void }) {
  const { addContribution, state } = useApp();
  const [kind, setKind] = useState<"cash" | "in-kind">("cash");
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState(500000);
  const [projectId, setProjectId] = useState(state.projects[0]?.id ?? "");

  const activeProject = state.projects.find((p) => p.id === projectId) ?? state.projects[0];
  const trees = Math.floor(amount / 250);
  const leadSpeciesId = activeProject?.speciesMix[0]?.speciesId ?? "prunus-africana";
  const topSpecies = SPECIES.find((s) => s.id === leadSpeciesId);

  const submit = () => {
    if (!donorName.trim() || amount <= 0 || !activeProject) return;
    addContribution({
      donor: donorName.trim(),
      kind,
      inKindKshEquivalent: kind === "in-kind" ? amount : 0,
      projectId: activeProject.id,
      amountKsh: kind === "cash" ? amount : 0,
      date: new Date().toISOString().slice(0, 10),
      treesAttributed: trees,
      verifiedSurviving: Math.round(trees * 0.86),
      certificateIssued: kind === "cash",
      note: "New contribution",
    });
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-emerald-950/60 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 48, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <p className="text-lg font-extrabold text-emerald-950">New contribution</p>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-sm text-stone-500">Fund verified tree planting with full ledger transparency.</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {(["cash", "in-kind"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              className={cn(
                "rounded-xl border-2 px-3 py-2 text-sm font-semibold capitalize",
                kind === k ? "border-emerald-700 bg-emerald-50 text-emerald-900" : "border-stone-200 text-stone-500 hover:border-stone-300",
              )}
            >
              {k === "cash" ? "Cash" : "In-kind"}
            </button>
          ))}
        </div>

        <label className="mt-4 block text-xs font-semibold text-stone-600">Donor / company</label>
        <input
          value={donorName}
          onChange={(e) => setDonorName(e.target.value)}
          placeholder="e.g. KCB Foundation"
          className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
        />

        <label className="mt-3 block text-xs font-semibold text-stone-600">Amount (KSh)</label>
        <input
          type="number"
          min={1000}
          value={amount}
          onChange={(e) => setAmount(Math.max(1000, Number(e.target.value) || 1000))}
          className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5 font-mono text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
        />

        <label className="mt-3 block text-xs font-semibold text-stone-600">Project</label>
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600"
        >
          {state.projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <div className="mt-4 flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3">
          <div className="text-sm">
            <p className="font-bold text-emerald-950">{trees.toLocaleString()} trees</p>
            <p className="text-xs text-emerald-700">Lead species: {topSpecies?.name ?? "—"}</p>
          </div>
          <div className="text-right text-sm">
            <p className="font-bold text-amber-700">{Math.round(trees * 0.22).toLocaleString()} KSh</p>
            <p className="text-xs text-amber-700/80">community rewards</p>
          </div>
        </div>

        <button
          onClick={submit}
          disabled={!donorName.trim() || amount <= 0}
          className="mt-4 w-full rounded-xl bg-emerald-800 py-3 text-sm font-bold text-stone-50 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Confirm contribution
        </button>
      </motion.div>
    </motion.div>
  );
}

function CertificateModal({
  projectId,
  projectName,
  cfaName,
  onClose,
}: {
  projectId: string;
  projectName: string;
  cfaName: string;
  onClose: () => void;
}) {
  const { state } = useApp();
  const [downloaded, setDownloaded] = useState(false);
  const c = state.contributions.find((x) => x.certificateIssued && x.projectId === projectId) ?? state.contributions[0];
  const trees = c?.verifiedSurviving ?? 0;
  const co2 = Math.round(trees * 0.44);

  return (
    <motion.div
      className="fixed inset-0 z-[85] flex items-end justify-center bg-emerald-950/60 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
        className="w-full max-w-lg rounded-3xl bg-stone-50 p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <p className="text-lg font-extrabold text-emerald-950">Verified Impact Certificate</p>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-200 text-stone-500 hover:bg-stone-300">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 rounded-2xl border-2 border-emerald-800 bg-white p-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-800 text-white">
            <Award className="h-7 w-7" />
          </div>
          <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-700">M-Miti · Verified Impact</p>
          <h3 className="mt-1 text-xl font-extrabold tracking-tight text-emerald-950">{projectName}</h3>
          <p className="text-sm text-stone-500">Community: {cfaName}</p>
          <div className="mt-4 grid grid-cols-3 gap-2 border-y border-dashed border-emerald-200 py-3">
            <div>
              <p className="font-mono text-lg font-extrabold text-emerald-900">{trees.toLocaleString()}</p>
              <p className="text-[10px] text-stone-400">verified surviving trees</p>
            </div>
            <div>
              <p className="font-mono text-lg font-extrabold text-emerald-900">{co2} t</p>
              <p className="text-[10px] text-stone-400">CO₂e (20y est.)</p>
            </div>
            <div>
              <p className="font-mono text-lg font-extrabold text-emerald-900">MRV ✓</p>
              <p className="text-[10px] text-stone-400">geotagged</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-stone-100">
              <QrCode className="h-12 w-12 text-emerald-950" />
            </div>
            <p className="max-w-[200px] text-left text-[11px] leading-snug text-stone-400">
              Scan to audit the public ledger, milestones and MRV proofs behind this certificate.
            </p>
          </div>
          <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-[11px] text-amber-900">
            This certifies verified tree-planting impact. It is <b>not</b> a carbon credit instrument — credits are
            issued separately under carbon standards.
          </p>
        </div>

        <button
          onClick={() => {
            setDownloaded(true);
            window.setTimeout(() => setDownloaded(false), 2200);
          }}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 py-3 text-sm font-bold text-stone-50 hover:bg-emerald-700"
        >
          {downloaded ? (
            <>
              <Check className="h-4 w-4" /> PDF simulated — check downloads
            </>
          ) : (
            <>
              <Download className="h-4 w-4" /> Download certificate (PDF)
            </>
          )}
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ---------------- CFA Community Wallet ---------------- */
function CfaWallet() {
  const { state, triggerPayout } = useApp();
  const [selectedCfaId, setSelectedCfaId] = useState(state.cfas[0]?.id ?? "");
  const [payoutOpen, setPayoutOpen] = useState(false);
  const cfa = state.cfas.find((c) => c.id === selectedCfaId) ?? state.cfas[0];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="font-bold text-emerald-950">Community Forest Association</p>
          <select
            value={selectedCfaId}
            onChange={(e) => setSelectedCfaId(e.target.value)}
            className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600"
          >
            {state.cfas.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {cfa && (
            <div className="mt-4 rounded-xl bg-emerald-950 p-4 text-stone-100">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                <PiggyBank className="h-4 w-4" /> Wallet balance
              </p>
              <motion.p
                key={cfa.walletKsh}
                initial={{ scale: 1.04 }}
                animate={{ scale: 1 }}
                className="mt-1 font-mono text-3xl font-extrabold text-amber-400"
              >
                {fmtKsh(cfa.walletKsh)}
              </motion.p>
              <p className="mt-1 text-[11px] text-emerald-300/70">
                Lifetime earned: {fmtKsh(cfa.lifetimeEarnedKsh)} · {cfa.members} members · {cfa.phoneNumber}
              </p>
              <button
                onClick={() => setPayoutOpen(true)}
                disabled={cfa.walletKsh <= 0}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-emerald-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Smartphone className="h-4 w-4" /> Trigger M-Pesa payout
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-sm font-bold text-emerald-950">How rewards accrue</p>
          <p className="mt-1 text-xs text-stone-500">
            Survival bonus: <span className="font-mono font-bold text-emerald-800">KSh 100</span> per 100 surviving
            trees verified by MRV.
          </p>
          <div className="mt-3 space-y-2 text-xs">
            {state.projects
              .filter((p) => p.cfaId === (cfa?.id ?? ""))
              .map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg bg-stone-50 px-3 py-2">
                  <span className="text-stone-600">{p.name}</span>
                  <span className="font-mono font-bold text-emerald-800">
                    {fmtKsh(Math.round(((p.plantedTrees * p.survivalRate) / 100) * 100))}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="font-bold text-emerald-950">M-Pesa B2C payout history</p>
          <p className="text-xs text-stone-500">Simulated Safaricom Business-to-Client transfers</p>
          <div className="mt-4 space-y-2">
            {(cfa?.payoutHistory ?? []).length === 0 && (
              <p className="rounded-xl bg-stone-50 p-4 text-center text-sm text-stone-500">No payouts yet for this CFA.</p>
            )}
            {(cfa?.payoutHistory ?? []).map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-xl border border-stone-100 bg-stone-50/60 px-4 py-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-stone-800">{p.reason}</p>
                  <p className="font-mono text-[11px] text-stone-400">{p.mpesaRef} · {p.date} · {p.recipient}</p>
                </div>
                <span className="font-mono text-sm font-bold text-emerald-900">{fmtKsh(p.amountKsh)}</span>
                <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", p.status === "Paid" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700")}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <StatCard label="Batches planted" value={String(cfa?.plantedBatches ?? 0)} />
          <StatCard
            label="Avg survival"
            value={`${Math.round(cfaProjectsSurvival())}%`}
          />
          <StatCard
            label="Next payout"
            value={cfa && cfa.walletKsh > 0 ? fmtKsh(Math.min(cfa.walletKsh, 100000)) : "—"}
            accent
          />
        </div>
      </div>

      {payoutOpen && cfa && (
        <PayoutSimulator
          cfa={cfa}
          onClose={() => setPayoutOpen(false)}
          onConfirm={(amountKsh, reason) => {
            const project = state.projects.find((p) => p.cfaId === cfa.id);
            triggerPayout({
              projectId: project?.id ?? state.projects[0]?.id ?? "mt-kenya-riparian",
              batchId: "wallet",
              amountKsh,
              reason,
              recipient: cfa.id,
            });
          }}
        />
      )}
    </div>
  );
}

function cfaProjectsSurvival() {
  return 86;
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4">
      <p className="text-[11px] uppercase tracking-wide text-stone-400">{label}</p>
      <p className={cn("font-mono text-2xl font-bold", accent ? "text-amber-700" : "text-emerald-950")}>{value}</p>
    </div>
  );
}

function PayoutSimulator({
  cfa,
  onClose,
  onConfirm,
}: {
  cfa: CFAGroup;
  onClose: () => void;
  onConfirm: (amountKsh: number, reason: string) => void;
}) {
  const [amount, setAmount] = useState(Math.min(cfa.walletKsh, 100000));
  const [step, setStep] = useState<"amount" | "processing" | "done">("amount");
  const [reason, setReason] = useState("Survival bonus disbursement");

  const submit = () => {
    setStep("processing");
    window.setTimeout(() => {
      setStep("done");
      onConfirm(amount, reason);
    }, 1800);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-emerald-950/60 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={step !== "processing" ? onClose : undefined}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
      >
        {step === "amount" && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-lg font-extrabold text-emerald-950">M-Pesa B2C payout</p>
              <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-500">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 text-sm text-stone-500">{cfa.name} · {cfa.phoneNumber}</p>
            <label className="mt-4 block text-xs font-semibold text-stone-600">Amount (KSh)</label>
            <input
              type="number"
              min={1}
              max={cfa.walletKsh}
              value={amount}
              onChange={(e) => setAmount(Math.max(1, Math.min(cfa.walletKsh, Number(e.target.value) || 0)))}
              className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5 font-mono text-lg font-bold text-emerald-950 outline-none focus:border-emerald-600"
            />
            <p className="mt-1 text-[11px] text-stone-400">Available: {fmtKsh(cfa.walletKsh)}</p>
            <label className="mt-3 block text-xs font-semibold text-stone-600">Reason / reference</label>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600"
            />
            <button
              onClick={submit}
              disabled={amount <= 0 || amount > cfa.walletKsh}
              className="mt-4 w-full rounded-xl bg-emerald-800 py-3 text-sm font-bold text-stone-50 hover:bg-emerald-700 disabled:opacity-40"
            >
              Send via M-Pesa
            </button>
            <p className="mt-2 text-center text-[11px] text-stone-400">Simulation — no real money moves.</p>
          </>
        )}
        {step === "processing" && (
          <div className="py-10 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-800"
            >
              <Smartphone className="h-7 w-7" />
            </motion.div>
            <p className="mt-4 font-bold text-emerald-950">Processing B2C transfer…</p>
            <p className="text-sm text-stone-500">Forwarding {fmtKsh(amount)} to {cfa.phoneNumber}</p>
          </div>
        )}
        {step === "done" && (
          <div className="py-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white"
            >
              <Check className="h-8 w-8" strokeWidth={3} />
            </motion.div>
            <p className="mt-4 text-lg font-extrabold text-emerald-950">Payment sent</p>
            <p className="mt-1 text-sm text-stone-500">
              {fmtKsh(amount)} to {cfa.name}. STK receipt generated.
            </p>
            <div className="mt-4 rounded-xl bg-stone-50 p-4 text-left font-mono text-xs text-stone-600">
              <p>M-PESA B2C · {fmtKsh(amount)}</p>
              <p>Ref: SIM B2C {Math.floor(88000000 + Math.random() * 999999)}</p>
              <p>Recipient: {cfa.name}</p>
            </div>
            <button onClick={onClose} className="mt-4 w-full rounded-xl bg-emerald-800 py-3 text-sm font-bold text-stone-50 hover:bg-emerald-700">
              Done
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}