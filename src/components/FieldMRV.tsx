import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BadgeCheck, Camera, Crosshair, MapPin, Plus, X } from "lucide-react";
import type { MRVSurvey } from "../types";
import { useApp } from "../context/AppContext";
import { SPECIES } from "../data/mockData";
import { cn } from "../lib/utils";

export function FieldMRV() {
  const { state, addBatch, addSurvey } = useApp();
  const [selectedBatchId, setSelectedBatchId] = useState(state.batches[0]?.id ?? "");
  const [showIntake, setShowIntake] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);

  const batches = state.batches;
  const selectedBatch = batches.find((b) => b.id === selectedBatchId) ?? batches[0];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Batch list */}
      <div className="lg:col-span-1">
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="font-bold text-emerald-950">Seedling batches</p>
            <button
              onClick={() => setShowIntake(true)}
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-800 px-2.5 py-1.5 text-xs font-semibold text-stone-50 hover:bg-emerald-700"
            >
              <Plus className="h-3.5 w-3.5" /> Intake
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {batches.map((b) => {
              const proj = state.projects.find((p) => p.id === b.projectId);
              const sp = SPECIES.find((s) => s.id === b.speciesId);
              return (
                <button
                  key={b.id}
                  onClick={() => setSelectedBatchId(b.id)}
                  className={cn(
                    "w-full rounded-xl border p-3 text-left transition",
                    selectedBatchId === b.id ? "border-emerald-700 bg-emerald-50" : "border-stone-100 bg-stone-50/60 hover:border-emerald-300",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-emerald-950">{b.batchName}</span>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      {b.surveys.length} surveys
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-stone-500">{proj?.name} · {sp?.emoji} {sp?.name}</p>
                  <p className="mt-1 font-mono text-[11px] text-stone-400">
                    {b.plantedCount.toLocaleString()} seedlings · {b.plot}
                  </p>
                </button>
              );
            })}
          </div>
          {batches.length === 0 && <p className="mt-4 text-center text-sm text-stone-500">No batches yet — log your first intake.</p>}
        </div>
      </div>

      {/* Batch detail */}
      <div className="lg:col-span-2">
        {selectedBatch && (
          <>
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-extrabold text-emerald-950">{selectedBatch.batchName}</p>
                  <p className="text-xs text-stone-500">
                    {state.projects.find((p) => p.id === selectedBatch.projectId)?.name} · planted{" "}
                    {selectedBatch.plantDate} · {selectedBatch.nurserySource}
                  </p>
                </div>
                <button
                  onClick={() => setShowSurvey(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-800 px-3.5 py-2.5 text-sm font-semibold text-stone-50 hover:bg-emerald-700"
                >
                  <Crosshair className="h-4 w-4" /> Log survival survey
                </button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl bg-stone-50 p-3">
                  <p className="font-mono text-lg font-bold text-emerald-950">{selectedBatch.plantedCount.toLocaleString()}</p>
                  <p className="text-[11px] text-stone-500">planted</p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-3">
                  <p className="font-mono text-lg font-bold text-emerald-900">{selectedBatch.surveys[0]?.survivingTrees?.toLocaleString() ?? "—"}</p>
                  <p className="text-[11px] text-emerald-700">last surviving</p>
                </div>
                <div className="rounded-xl bg-amber-50 p-3">
                  <p className="font-mono text-lg font-bold text-amber-800">
                    {selectedBatch.surveys[0] ? Math.round((selectedBatch.surveys[0].survivingTrees / selectedBatch.plantedCount) * 100) : "—"}%
                  </p>
                  <p className="text-[11px] text-amber-700">survival</p>
                </div>
                <div className="rounded-xl bg-stone-50 p-3">
                  <p className="font-mono text-lg font-bold text-emerald-950">
                    <MapPin className="inline h-4 w-4 text-emerald-600" /> {selectedBatch.gpsLat.toFixed(4)}, {selectedBatch.gpsLng.toFixed(4)}
                  </p>
                  <p className="text-[11px] text-stone-500">GPS plot</p>
                </div>
              </div>
            </div>

            {/* Survey timeline */}
            <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-5">
              <p className="font-bold text-emerald-950">MRV survey timeline</p>
              <p className="text-xs text-stone-500">Geotagged survival checks: 3, 6, 12 and 24 months</p>
              {selectedBatch.surveys.length === 0 && (
                <p className="mt-4 rounded-xl bg-stone-50 p-4 text-center text-sm text-stone-500">
                  No surveys logged. Log the first survival check to unlock the Verified badge.
                </p>
              )}
              <div className="mt-4 space-y-3">
                {selectedBatch.surveys.map((s) => (
                  <SurveyCard key={s.id} survey={s} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {showIntake && (
        <IntakeModal
          onClose={() => setShowIntake(false)}
          onSave={(b) => {
            addBatch(b);
            setShowIntake(false);
          }}
        />
      )}
      {showSurvey && selectedBatch && (
        <SurveyModal
          batchId={selectedBatch.id}
          plantedCount={selectedBatch.plantedCount}
          onClose={() => setShowSurvey(false)}
          onSave={(survey) => {
            addSurvey(selectedBatch.id, survey);
            setShowSurvey(false);
          }}
        />
      )}
    </div>
  );
}

function SurveyCard({ survey }: { survey: MRVSurvey }) {
  return (
    <div className="rounded-xl border border-stone-100 bg-stone-50/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-800 px-2.5 py-1 text-[11px] font-bold text-stone-50">{survey.period}</span>
          <span className="font-mono text-xs text-stone-500">{survey.date}</span>
        </div>
        <span className="flex items-center gap-1 font-mono text-sm font-bold text-emerald-900">
          <BadgeCheck className="h-4 w-4 text-emerald-600" /> {survey.survivingTrees.toLocaleString()} surviving
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-stone-600 sm:grid-cols-4">
        <div>
          <p className="text-[10px] uppercase text-stone-400">Mortality</p>
          <p className="font-mono font-bold text-red-600">{survey.mortalityCount.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-stone-400">Canopy</p>
          <p className="font-mono font-bold text-emerald-800">{survey.canopyCoveragePct}%</p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-stone-400">GPS</p>
          <p className="font-mono font-bold">{survey.gpsLat.toFixed(4)}, {survey.gpsLng.toFixed(4)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-stone-400">Proof</p>
          <p className="font-bold text-emerald-700">{survey.photoProof ? "Photo attached ✓" : "No photo"}</p>
        </div>
      </div>
      {survey.notes && <p className="mt-2 text-xs italic text-stone-500">“{survey.notes}”</p>}
      <p className="mt-1 text-[11px] text-stone-400">Officer: {survey.officerName}</p>
    </div>
  );
}

function IntakeModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (b: { projectId: string; batchName: string; speciesId: string; plantedCount: number; plantDate: string; plot: string; gpsLat: number; gpsLng: number; nurserySource: string }) => void;
}) {
  const { state } = useApp();
  const [projectId, setProjectId] = useState(state.projects[0]?.id ?? "");
  const [batchName, setBatchName] = useState("");
  const [speciesId, setSpeciesId] = useState(SPECIES[0].id);
  const [plantedCount, setPlantedCount] = useState(5000);
  const [plantDate, setPlantDate] = useState(new Date().toISOString().slice(0, 10));
  const [plot, setPlot] = useState("");
  const [lat, setLat] = useState(-0.42);
  const [lng, setLng] = useState(37.19);
  const [nursery, setNursery] = useState("");

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
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <p className="text-lg font-extrabold text-emerald-950">New seedling batch intake</p>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-500">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-sm text-stone-500">Register a planted batch for MRV tracking.</p>

        <label className="mt-4 block text-xs font-semibold text-stone-600">Project</label>
        <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600">
          {state.projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-600">Batch name</label>
            <input value={batchName} onChange={(e) => setBatchName(e.target.value)} placeholder="e.g. Riparian Row B1" className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600">Plot</label>
            <input value={plot} onChange={(e) => setPlot(e.target.value)} placeholder="e.g. Plot 12" className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600" />
          </div>
        </div>

        <label className="mt-3 block text-xs font-semibold text-stone-600">Species</label>
        <select value={speciesId} onChange={(e) => setSpeciesId(e.target.value)} className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600">
          {SPECIES.map((s) => <option key={s.id} value={s.id}>{s.emoji} {s.name} — {s.type}</option>)}
        </select>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-600">Seedlings planted</label>
            <input type="number" min={1} value={plantedCount} onChange={(e) => setPlantedCount(Math.max(1, Number(e.target.value) || 1))} className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5 font-mono text-sm outline-none focus:border-emerald-600" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600">Plant date</label>
            <input type="date" value={plantDate} onChange={(e) => setPlantDate(e.target.value)} className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600" />
          </div>
        </div>

        <label className="mt-3 block text-xs font-semibold text-stone-600">Nursery source</label>
        <input value={nursery} onChange={(e) => setNursery(e.target.value)} placeholder="e.g. Greenline Nursery Nyeri" className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600" />

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-600">GPS latitude</label>
            <input type="number" step="0.0001" value={lat} onChange={(e) => setLat(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5 font-mono text-sm outline-none focus:border-emerald-600" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600">GPS longitude</label>
            <input type="number" step="0.0001" value={lng} onChange={(e) => setLng(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5 font-mono text-sm outline-none focus:border-emerald-600" />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 rounded-xl bg-sky-50 px-3 py-2 text-[11px] text-sky-800">
          <MapPin className="h-3.5 w-3.5" /> Demo GPS simulator — in production the device GPS autofills this.
        </div>

        <button
          onClick={() =>
            onSave({
              projectId,
              batchName: batchName || `Batch ${Date.now().toString(36)}`,
              speciesId,
              plantedCount,
              plantDate,
              plot: plot || "Unassigned",
              gpsLat: lat,
              gpsLng: lng,
              nurserySource: nursery || "CFA nursery",
            })
          }
          disabled={plantedCount <= 0}
          className="mt-4 w-full rounded-xl bg-emerald-800 py-3 text-sm font-bold text-stone-50 hover:bg-emerald-700 disabled:opacity-40"
        >
          Register batch
        </button>
      </motion.div>
    </motion.div>
  );
}

function SurveyModal({
  batchId,
  plantedCount,
  onClose,
  onSave,
}: {
  batchId: string;
  plantedCount: number;
  onClose: () => void;
  onSave: (s: Omit<MRVSurvey, "id">) => void;
}) {
  const [period, setPeriod] = useState<MRVSurvey["period"]>("3-Month");
  const [surviving, setSurviving] = useState(Math.round(plantedCount * 0.88));
  const [canopy, setCanopy] = useState(12);
  const [photo, setPhoto] = useState(true);
  const [notes, setNotes] = useState("");
  const [lat, setLat] = useState(-0.4172);
  const [lng, setLng] = useState(37.1912);
  const [officer, setOfficer] = useState("J. Wanjiru");

  const mortality = Math.max(0, plantedCount - surviving);

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
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <p className="text-lg font-extrabold text-emerald-950">Log survival survey</p>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-500">
            <X className="h-4 w-4" />
          </button>
        </div>

        <label className="mt-4 block text-xs font-semibold text-stone-600">Survey interval</label>
        <div className="mt-1 grid grid-cols-4 gap-1.5">
          {(["3-Month", "6-Month", "12-Month", "24-Month"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "rounded-lg border px-2 py-2 text-xs font-semibold",
                period === p ? "border-emerald-700 bg-emerald-800 text-stone-50" : "border-stone-200 text-stone-500 hover:border-emerald-400",
              )}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-600">Surviving trees</label>
            <input
              type="number"
              min={0}
              max={plantedCount}
              value={surviving}
              onChange={(e) => setSurviving(Math.max(0, Math.min(plantedCount, Number(e.target.value) || 0)))}
              className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5 font-mono text-sm outline-none focus:border-emerald-600"
            />
          </div>
          <div className="rounded-xl bg-stone-50 p-3">
            <p className="text-[10px] uppercase text-stone-400">Resulting survival</p>
            <p className="font-mono text-lg font-bold text-emerald-950">{Math.round((surviving / plantedCount) * 100)}%</p>
            <p className="text-[11px] text-red-500">{mortality.toLocaleString()} mortality</p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-600">Canopy coverage</label>
            <input
              type="number"
              min={0}
              max={100}
              value={canopy}
              onChange={(e) => setCanopy(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
              className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5 font-mono text-sm outline-none focus:border-emerald-600"
            />
            <p className="mt-0.5 text-[10px] text-stone-400">% canopy in sampled plots</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600">Photo proof</label>
            <button
              onClick={() => setPhoto((v) => !v)}
              className={cn(
                "mt-1 flex w-full items-center justify-center gap-2 rounded-xl border-2 py-2.5 text-sm font-semibold",
                photo ? "border-emerald-700 bg-emerald-50 text-emerald-900" : "border-stone-200 text-stone-500",
              )}
            >
              <Camera className="h-4 w-4" /> {photo ? "Attached ✓" : "Attach photo"}
            </button>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-600">GPS latitude</label>
            <input type="number" step="0.0001" value={lat} onChange={(e) => setLat(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5 font-mono text-sm outline-none focus:border-emerald-600" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600">GPS longitude</label>
            <input type="number" step="0.0001" value={lng} onChange={(e) => setLng(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5 font-mono text-sm outline-none focus:border-emerald-600" />
          </div>
        </div>

        <label className="mt-3 block text-xs font-semibold text-stone-600">Officer name</label>
        <input value={officer} onChange={(e) => setOfficer(e.target.value)} className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600" />

        <label className="mt-3 block text-xs font-semibold text-stone-600">Field notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="e.g. Browsing low, stakes intact"
          className="mt-1 w-full resize-none rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600"
        />

        <button
          onClick={() =>
            onSave({
              batchId,
              period,
              date: new Date().toISOString().slice(0, 10),
              surveyedTrees: plantedCount,
              survivingTrees: surviving,
              mortalityCount: mortality,
              gpsLat: lat,
              gpsLng: lng,
              canopyCoveragePct: canopy,
              photoProof: photo,
              officerName: officer || "Field officer",
              notes,
            })
          }
          className="mt-4 w-full rounded-xl bg-emerald-800 py-3 text-sm font-bold text-stone-50 hover:bg-emerald-700"
        >
          Save survey — {Math.round((surviving / plantedCount) * 100)}% survival
        </button>
      </motion.div>
    </motion.div>
  );
}