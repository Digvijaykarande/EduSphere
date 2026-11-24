"use client";

import { useState } from "react";
import { Check, Pencil, Plus, Scale, Tags, Trash2, X } from "lucide-react";
import {
  formatMarks,
  formatPoints,
  pointsChipClass,
  rawMarks,
  round2,
  validateCategory,
  validateSettings,
} from "./performance.utils";

const inputCls =
  "w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-sm text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";
const labelCls = "block text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1";

/* ---------------------------- categories ---------------------------- */

function CategoryForm({ categories, editing, onSave, onCancel }) {
  const [label, setLabel] = useState(editing?.label ?? "");
  const [points, setPoints] = useState(editing ? String(editing.points) : "");
  const [purpose, setPurpose] = useState(editing?.purpose ?? "");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const msg = validateCategory(label, points, categories, editing?.id ?? null);
    if (msg) return setError(msg);
    onSave({ id: editing?.id, label, points: Number(points), purpose });
  };

  return (
    <form onSubmit={submit} noValidate
      className="rounded-2xl border border-primary/25 bg-primary/5 p-3 sm:p-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_130px] gap-3">
        <div>
          <label htmlFor="cat-name" className={labelCls}>Category name</label>
          <input id="cat-name" className={inputCls} value={label} maxLength={40} autoFocus
            placeholder="e.g. Correct answer" onChange={(e) => { setLabel(e.target.value); setError(""); }} />
        </div>
        <div>
          <label htmlFor="cat-points" className={labelCls}>Points (− to deduct)</label>
          <input id="cat-points" type="number" inputMode="decimal" step="any" className={`${inputCls} font-bold tabular-nums`}
            value={points} placeholder="0" onChange={(e) => { setPoints(e.target.value); setError(""); }} />
        </div>
      </div>
      <div>
        <label htmlFor="cat-purpose" className={labelCls}>Description (optional)</label>
        <input id="cat-purpose" className={inputCls} value={purpose} maxLength={120}
          placeholder="Shown as a hint when awarding" onChange={(e) => setPurpose(e.target.value)} />
      </div>
      {error && <p role="alert" className="text-xs font-semibold text-rose-600 dark:text-rose-400">{error}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel}
          className="h-9 px-4 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer">
          Cancel
        </button>
        <button type="submit"
          className="h-9 px-5 rounded-full bg-primary text-white text-xs font-bold hover:opacity-90 inline-flex items-center gap-1.5 cursor-pointer">
          <Check size={14} /> {editing ? "Save changes" : "Add category"}
        </button>
      </div>
    </form>
  );
}

function CategoriesCard({ categories, settings, onSave, onDelete }) {
  const [formFor, setFormFor] = useState(null); // null | "new" | category id
  const [confirmDelete, setConfirmDelete] = useState(null);

  const editing = formFor && formFor !== "new" ? categories.find((c) => c.id === formFor) : null;
  const closeForm = () => setFormFor(null);

  return (
    <section className="dashboard-card p-4 sm:p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className="stat-icon-box stat-icon-violet !h-10 !w-10"><Tags size={18} /></span>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-foreground tracking-tight">Point categories</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Define what you reward or deduct, and how many points each is worth.
            </p>
          </div>
        </div>
        {formFor === null && (
          <button type="button" onClick={() => setFormFor("new")}
            className="shrink-0 h-9 px-4 rounded-full bg-primary text-white text-xs font-bold hover:opacity-90 inline-flex items-center gap-1.5 cursor-pointer">
            <Plus size={14} /> <span className="hidden sm:inline">Add category</span><span className="sm:hidden">Add</span>
          </button>
        )}
      </div>

      {formFor === "new" && (
        <CategoryForm categories={categories} onCancel={closeForm}
          onSave={(c) => { onSave(c); closeForm(); }} />
      )}

      {categories.length === 0 && formFor !== "new" ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 py-10 px-6 text-center">
          <Tags className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
          <p className="text-sm font-semibold text-foreground">No categories yet</p>
          <p className="text-xs text-slate-500 mt-1">Create the first one, for example “Correct answer” worth 10 points.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {categories.map((c) => {
            if (formFor === c.id) {
              return (
                <li key={c.id} className="lg:col-span-2">
                  <CategoryForm categories={categories} editing={editing} onCancel={closeForm}
                    onSave={(v) => { onSave(v); closeForm(); }} />
                </li>
              );
            }
            const worth = rawMarks(c.points, settings);
            return (
              <li key={c.id} className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className={`shrink-0 min-w-12 text-center text-xs font-bold px-2 py-1 rounded-lg tabular-nums ${pointsChipClass(c.points)}`}>
                  {formatPoints(c.points)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-foreground truncate">{c.label}</span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {worth !== null && (
                      <span className="font-semibold tabular-nums">{worth > 0 ? "+" : ""}{formatMarks(worth)} marks</span>
                    )}
                    {worth !== null && c.purpose ? " · " : ""}
                    {c.purpose}
                  </span>
                </span>
                {confirmDelete === c.id ? (
                  <span className="flex items-center gap-1.5 shrink-0">
                    <button type="button" onClick={() => { onDelete(c.id); setConfirmDelete(null); }}
                      className="h-8 px-3 rounded-full bg-rose-600 text-white text-[11px] font-bold cursor-pointer">Delete</button>
                    <button type="button" onClick={() => setConfirmDelete(null)} aria-label="Cancel delete"
                      className="h-8 w-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 cursor-pointer"><X size={14} /></button>
                  </span>
                ) : (
                  <span className="flex items-center shrink-0">
                    <button type="button" aria-label={`Edit ${c.label}`} onClick={() => setFormFor(c.id)}
                      className="h-9 w-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary cursor-pointer"><Pencil size={15} /></button>
                    <button type="button" aria-label={`Delete ${c.label}`} onClick={() => setConfirmDelete(c.id)}
                      className="h-9 w-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 cursor-pointer"><Trash2 size={15} /></button>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {categories.length > 0 && (
        <p className="text-[11px] text-slate-400">Deleting a category keeps past awards in History and the leaderboard.</p>
      )}
    </section>
  );
}

/* ---------------------------- marks weightage ---------------------------- */

function MarksCard({ settings, onSave }) {
  const [enabled, setEnabled] = useState(settings.marksEnabled);
  const [total, setTotal] = useState(settings.totalMarks != null ? String(settings.totalMarks) : "");
  const [full, setFull] = useState(settings.pointsForFull != null ? String(settings.pointsForFull) : "");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const draftError = enabled ? validateSettings(total, full) : "";
  const dirty =
    enabled !== settings.marksEnabled ||
    (enabled && (Number(total) !== settings.totalMarks || Number(full) !== settings.pointsForFull));

  const preview = enabled && !draftError
    ? (() => {
        const half = round2(Number(full) / 2);
        return `${formatMarks(half)} points = ${formatMarks(Number(total) / 2)} of ${formatMarks(Number(total))} marks`;
      })()
    : null;

  const submit = (e) => {
    e.preventDefault();
    if (draftError) return setError(draftError);
    onSave({ marksEnabled: enabled, totalMarks: Number(total), pointsForFull: Number(full) });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <section className="dashboard-card p-4 sm:p-5">
      <form onSubmit={submit} noValidate className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <span className="stat-icon-box stat-icon-orange !h-10 !w-10"><Scale size={18} /></span>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-foreground tracking-tight">Marks weightage</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Optional. Turn points into marks for your internal assessment.
              </p>
            </div>
          </div>
          <button type="button" role="switch" aria-checked={enabled} aria-label="Convert points into marks"
            onClick={() => { setEnabled((v) => !v); setError(""); }}
            className={`relative shrink-0 h-6 w-11 rounded-full transition-colors cursor-pointer ${enabled ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"}`}>
            <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-5" : ""}`} />
          </button>
        </div>

        {enabled && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="mk-total" className={labelCls}>Total marks</label>
                <input id="mk-total" type="number" inputMode="decimal" step="any" className={`${inputCls} font-bold tabular-nums`}
                  value={total} placeholder="e.g. 10" onChange={(e) => { setTotal(e.target.value); setError(""); }} />
              </div>
              <div>
                <label htmlFor="mk-full" className={labelCls}>Points needed for full marks</label>
                <input id="mk-full" type="number" inputMode="decimal" step="any" className={`${inputCls} font-bold tabular-nums`}
                  value={full} placeholder="e.g. 100" onChange={(e) => { setFull(e.target.value); setError(""); }} />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {preview ? <span className="font-semibold text-foreground">{preview}. </span> : null}
              Marks are worked out for whichever week or month you view on the leaderboard, capped at the total and never below 0.
            </p>
          </div>
        )}

        {(error || (dirty && draftError)) && (
          <p role="alert" className="text-xs font-semibold text-rose-600 dark:text-rose-400">{error || draftError}</p>
        )}

        <div className="flex items-center justify-end gap-3">
          {saved && <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1"><Check size={13} /> Saved</span>}
          <button type="submit" disabled={!dirty}
            className="h-9 px-5 rounded-full bg-primary text-white text-xs font-bold hover:opacity-90 disabled:opacity-40 disabled:pointer-events-none cursor-pointer">
            Save weightage
          </button>
        </div>
      </form>
    </section>
  );
}

export default function ScoringSetup({ categories, settings, onSaveCategory, onDeleteCategory, onSaveSettings }) {
  return (
    <div className="space-y-4">
      <CategoriesCard categories={categories} settings={settings} onSave={onSaveCategory} onDelete={onDeleteCategory} />
      {/* Re-mount when stored settings change (e.g. another tab) so the form stays in step. */}
      <MarksCard key={`${settings.marksEnabled}-${settings.totalMarks}-${settings.pointsForFull}`} settings={settings} onSave={onSaveSettings} />
    </div>
  );
}
