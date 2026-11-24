"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle, ChevronDown, History, ListChecks, Loader2, RefreshCw, SlidersHorizontal,
  Star, Trophy, Undo2, Users, X,
} from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import ScoringList from "./ScoringList";
import Leaderboard from "./Leaderboard";
import HistoryPanel from "./HistoryPanel";
import PointPickerModal from "./PointPickerModal";
import ScoringSetup from "./ScoringSetup";
import { usePerformanceData } from "./usePerformanceData";
import { useToday } from "./useToday";
import {
  addDays, compareRoll, compareText, formatPoints, getRange, sumByStudent, uid,
} from "./performance.utils";

const TABS = [
  { id: "score", label: "Score", icon: ListChecks },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  { id: "history", label: "History", icon: History },
  { id: "setup", label: "Setup", icon: SlidersHorizontal },
];

function normalizeStudent(s) {
  const id = s.studentId ?? s._id ?? s.id;
  if (id == null || id === "") return null;
  return {
    id: String(id),
    name: s.name || "Unnamed student",
    roll: s.rollNumber ?? s.rollNo ?? null,
    photo: s.photo || s.photoUrl || s.avatar || s.profileImage || s.profilePicture || null,
  };
}

function Stat({ label, value, sub }) {
  return (
    <div className="min-w-0 px-3 sm:px-4 py-2.5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">{label}</p>
      <p className="text-base sm:text-lg font-extrabold text-foreground tabular-nums truncate leading-tight">{value}</p>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{sub}</p>
    </div>
  );
}

function ErrorCard({ message, onRetry }) {
  return (
    <div className="dashboard-card py-14 px-6 text-center">
      <AlertCircle className="mx-auto h-7 w-7 text-rose-500 mb-2" />
      <p className="text-sm font-semibold text-foreground">{message}</p>
      <button type="button" onClick={onRetry}
        className="mt-4 h-9 px-5 rounded-full bg-primary text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer">
        <RefreshCw size={14} /> Try again
      </button>
    </div>
  );
}

export default function ClassPerformancePage() {
  const user = useAuthStore((s) => s.user);
  const ownerId = user?._id || user?.id || user?.slug || user?.email || null;

  const data = usePerformanceData(ownerId);
  const { categories, events, settings, addEvents, removeEvents, restoreEvents, saveCategory, deleteCategory, saveSettings } = data;

  const today = useToday(); // local midnight; changes when the day rolls over
  const [tab, setTab] = useState("score");
  const [board, setBoard] = useState({ period: "week", offset: 0 });

  /* ---- sections (teacher's own classes) ---- */
  const [sections, setSections] = useState([]);
  const [sectionsLoading, setSectionsLoading] = useState(true);
  const [sectionsError, setSectionsError] = useState("");
  const [sectionId, setSectionId] = useState("");

  const loadSections = useCallback(async () => {
    setSectionsLoading(true);
    setSectionsError("");
    try {
      const res = await api.getMyAssignments();
      const seen = new Map();
      for (const a of res?.data?.assignments || []) {
        const sec = a.sectionId;
        if (sec?._id && !seen.has(String(sec._id))) {
          seen.set(String(sec._id), { id: String(sec._id), label: `Class ${sec.gradeClass} – ${sec.section}` });
        }
      }
      const list = [...seen.values()].sort((a, b) => compareText(a.label, b.label));
      setSections(list);
      setSectionId((cur) => (cur && list.some((s) => s.id === cur) ? cur : list[0]?.id || ""));
    } catch (err) {
      setSectionsError(err instanceof ApiError ? err.message : "Failed to load your classes.");
    } finally {
      setSectionsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSections();
  }, [loadSections]);

  /* ---- roster for the selected section ---- */
  // The roster is tagged with the request it belongs to, so a previous class's
  // students can never show up under a newly selected class (or after a failure).
  const [rosterTick, setRosterTick] = useState(0);
  const rosterKey = sectionId ? `${sectionId}:${rosterTick}` : "";
  const [roster, setRoster] = useState({ key: "", students: [], error: "" });

  useEffect(() => {
    if (!rosterKey) return;
    let cancelled = false;
    api.getSectionRoster(sectionId)
      .then((res) => {
        if (cancelled) return;
        const students = (res?.data?.roster || []).map(normalizeStudent).filter(Boolean).sort(compareRoll);
        setRoster({ key: rosterKey, students, error: "" });
      })
      .catch((err) => {
        if (cancelled) return;
        setRoster({ key: rosterKey, students: [], error: err instanceof ApiError ? err.message : "Failed to load students." });
      });
    return () => { cancelled = true; };
  }, [rosterKey, sectionId]);

  const rosterLoading = !!rosterKey && roster.key !== rosterKey;
  const rosterError = !rosterLoading && roster.key === rosterKey ? roster.error : "";
  const students = useMemo(() => (!rosterLoading && roster.key === rosterKey ? roster.students : []), [rosterLoading, roster, rosterKey]);

  /* ---- derived data ---- */
  const sectionEvents = useMemo(() => events.filter((e) => e.sectionId === sectionId), [events, sectionId]);
  const sectionLabel = sections.find((s) => s.id === sectionId)?.label || "";

  const todayRange = useMemo(() => ({ start: new Date(today), end: addDays(new Date(today), 1) }), [today]);
  const weekRange = useMemo(() => getRange("week", new Date(today)), [today]);
  const todayMap = useMemo(() => sumByStudent(sectionEvents, todayRange), [sectionEvents, todayRange]);
  const weekMap = useMemo(() => sumByStudent(sectionEvents, weekRange), [sectionEvents, weekRange]);

  const todayTotal = [...todayMap.values()].reduce((a, v) => a + v.points, 0);
  const todayActions = [...todayMap.values()].reduce((a, v) => a + v.count, 0);
  const topToday = useMemo(() => {
    let best = null;
    for (const s of students) {
      const p = todayMap.get(s.id)?.points;
      if (p > 0 && (!best || p > best.points)) best = { name: s.name, points: p };
    }
    return best;
  }, [students, todayMap]);

  /* ---- selection (tap-to-select mode, no checkboxes) ---- */
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState(() => new Set());
  const clearSelection = () => setSelected(new Set());
  const exitSelect = () => { setSelectMode(false); clearSelection(); };
  const toggleSelectMode = () => (selectMode ? exitSelect() : setSelectMode(true));
  const toggle = (id) => setSelected((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const toggleAll = (ids, on) => setSelected((prev) => { const n = new Set(prev); ids.forEach((id) => (on ? n.add(id) : n.delete(id))); return n; });
  const changeSection = (id) => { setSectionId(id); exitSelect(); };

  // Drop selections that no longer exist (e.g. after the roster reloads).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelected((prev) => {
      if (prev.size === 0) return prev;
      const ids = new Set(students.map((s) => s.id));
      const next = new Set([...prev].filter((id) => ids.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [students]);

  /* ---- toasts (stacked, each with its own undo) ---- */
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());
  const dismissToast = useCallback((id) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);
  const pushToast = useCallback((message, undo) => {
    const id = uid();
    setToasts((t) => [...t.slice(-2), { id, message, undo }]);
    timers.current.set(id, setTimeout(() => dismissToast(id), 6000));
  }, [dismissToast]);
  useEffect(() => {
    const map = timers.current;
    return () => map.forEach((t) => clearTimeout(t));
  }, []);

  /* ---- awarding ---- */
  const [picker, setPicker] = useState(null); // array of target students

  const applyAward = (payload, saveAsCategory) => {
    const targets = picker || [];
    if (!targets.length || !sectionId || !Number.isFinite(payload.points)) return;
    let categoryId = payload.categoryId;
    if (saveAsCategory) categoryId = saveCategory({ label: payload.label, points: payload.points, purpose: "" }).id;
    const created = addEvents(
      targets.map((t) => ({
        sectionId,
        studentId: t.id,
        studentName: t.name,
        rollNumber: t.roll,
        categoryId: categoryId || null,
        label: payload.label,
        points: payload.points,
      })),
    );
    setPicker(null);
    exitSelect();
    const who = targets.length === 1 ? targets[0].name : `${targets.length} students`;
    const ids = created.map((e) => e.id);
    pushToast(`${formatPoints(payload.points)} · ${payload.label} → ${who}`, () => removeEvents(ids));
  };

  const deleteEvent = (e) => {
    removeEvents([e.id]);
    pushToast(`Removed ${formatPoints(e.points)} · ${e.label} (${e.studentName})`, () => restoreEvents([e]));
  };

  const selectedStudents = students.filter((s) => selected.has(s.id));

  /* ---- tabs (arrow-key navigation) ---- */
  const onTabKey = (e) => {
    const i = TABS.findIndex((t) => t.id === tab);
    let n = i;
    if (e.key === "ArrowRight") n = (i + 1) % TABS.length;
    else if (e.key === "ArrowLeft") n = (i - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = TABS.length - 1;
    else return;
    e.preventDefault();
    setTab(TABS[n].id);
    document.getElementById(`cp-tab-${TABS[n].id}`)?.focus();
  };
  const switchTab = (id) => { setTab(id); if (id !== "score") exitSelect(); };

  /* ---- render ---- */
  if (!user || sectionsLoading || !data.ready) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-sm text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading…
      </div>
    );
  }

  const needsClass = tab !== "setup";

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
      className="max-w-[1200px] mx-auto space-y-4 pb-28">
      {/* Header: title + class picker, nothing else */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">Class Performance</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Recognise effort in class and track rankings.</p>
        </div>
        {sections.length > 0 && (
          <div className="relative sm:w-52">
            <select value={sectionId} onChange={(e) => changeSection(e.target.value)} aria-label="Select class"
              className="w-full h-10 appearance-none rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-4 pr-9 text-sm font-bold text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer">
              {sections.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
            <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        )}
      </div>

      {data.storageError && (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-4 py-3 text-xs font-semibold text-amber-800 dark:text-amber-300">
          <AlertCircle size={15} className="shrink-0 mt-px" />
          Browser storage is full or blocked, so changes may not be saved after you close this page.
        </div>
      )}

      {sectionsError ? (
        <ErrorCard message={sectionsError} onRetry={loadSections} />
      ) : (
        <>
          {/* Tabs */}
          <div role="tablist" aria-label="Class performance sections" onKeyDown={onTabKey}
            className="flex p-1 rounded-full bg-slate-100 dark:bg-slate-800/80 w-full sm:w-fit overflow-x-auto">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} id={`cp-tab-${id}`} role="tab" type="button"
                aria-selected={tab === id} aria-controls={`cp-panel-${id}`} tabIndex={tab === id ? 0 : -1}
                onClick={() => switchTab(id)}
                className={`flex-1 sm:flex-none shrink-0 flex items-center justify-center gap-1.5 px-3 sm:px-5 h-9 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  tab === id ? "bg-white dark:bg-slate-900 text-primary shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-foreground"
                }`}>
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          <div role="tabpanel" id={`cp-panel-${tab}`} aria-labelledby={`cp-tab-${tab}`} className="space-y-3">
            {!needsClass ? (
              <ScoringSetup
                categories={categories}
                settings={settings}
                onSaveCategory={saveCategory}
                onDeleteCategory={deleteCategory}
                onSaveSettings={saveSettings}
              />
            ) : sections.length === 0 ? (
              <div className="dashboard-card py-14 px-6 text-center">
                <Users className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-sm font-semibold text-foreground">You haven&apos;t been assigned to any class yet</p>
                <p className="text-xs text-slate-500 mt-1">Contact your school administrator to get a class assigned.</p>
              </div>
            ) : rosterLoading ? (
              <div className="dashboard-card flex items-center justify-center gap-2 py-20 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading students…
              </div>
            ) : rosterError ? (
              <ErrorCard message={rosterError} onRetry={() => setRosterTick((t) => t + 1)} />
            ) : (
              <>
                {tab === "score" && (
                  <>
                    <div className="dashboard-card grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100 dark:divide-slate-800 [&>*:nth-child(n+3)]:border-t sm:[&>*:nth-child(n+3)]:border-t-0 [&>*]:border-slate-100 dark:[&>*]:border-slate-800">
                      <Stat label="Students" value={students.length} sub={sectionLabel} />
                      <Stat label="Points today" value={formatPoints(todayTotal)} sub={`${todayActions} award${todayActions === 1 ? "" : "s"}`} />
                      <Stat label="Recognised" value={`${todayMap.size}/${students.length}`} sub="students today" />
                      <Stat label="Top today" value={topToday ? topToday.name : "—"} sub={topToday ? `${formatPoints(topToday.points)} pts` : "No points yet"} />
                    </div>

                    {categories.length === 0 && (
                      <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 flex items-center gap-3">
                        <p className="text-xs text-slate-600 dark:text-slate-300 flex-1">
                          Create your own point categories and marks weightage to award with one tap.
                        </p>
                        <button type="button" onClick={() => switchTab("setup")}
                          className="shrink-0 h-8 px-4 rounded-full bg-primary text-white text-xs font-bold cursor-pointer">
                          Set up
                        </button>
                      </div>
                    )}

                    <ScoringList
                      students={students}
                      todayMap={todayMap}
                      weekMap={weekMap}
                      selectMode={selectMode}
                      selected={selected}
                      onToggleSelectMode={toggleSelectMode}
                      onToggle={toggle}
                      onToggleAll={toggleAll}
                      onAward={(s) => setPicker([s])}
                    />
                  </>
                )}
                {tab === "leaderboard" && (
                  <Leaderboard
                    students={students}
                    events={sectionEvents}
                    sectionLabel={sectionLabel}
                    settings={settings}
                    period={board.period}
                    offset={board.offset}
                    baseDate={new Date(today)}
                    onChange={setBoard}
                  />
                )}
                {tab === "history" && <HistoryPanel events={sectionEvents} onDelete={deleteEvent} />}
              </>
            )}
          </div>
        </>
      )}

      {picker && (
        <PointPickerModal
          targets={picker}
          categories={categories}
          onApply={applyAward}
          onClose={() => setPicker(null)}
          onOpenSetup={() => { setPicker(null); switchTab("setup"); }}
        />
      )}

      {/* Floating layer: toasts + bulk bar share one stack so they never overlap */}
      <div className="fixed inset-x-0 bottom-0 z-[70] flex flex-col items-center gap-2 px-4 pointer-events-none"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
        {toasts.map((t) => (
          <div key={t.id} role="status" aria-live="polite"
            className="pointer-events-auto w-full max-w-md rounded-2xl bg-slate-900 text-white shadow-2xl px-4 py-2.5 flex items-center gap-3">
            <p className="text-xs font-semibold flex-1 min-w-0 truncate">{t.message}</p>
            {t.undo && (
              <button type="button" onClick={() => { t.undo(); dismissToast(t.id); }}
                className="shrink-0 h-8 px-3 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                <Undo2 size={13} /> Undo
              </button>
            )}
            <button type="button" onClick={() => dismissToast(t.id)} aria-label="Dismiss" className="shrink-0 text-slate-400 hover:text-white cursor-pointer"><X size={15} /></button>
          </div>
        ))}
        {tab === "score" && selectMode && selected.size > 0 && (
          <div className="pointer-events-auto w-full max-w-md rounded-2xl bg-slate-900 text-white shadow-2xl px-4 py-2.5 flex items-center gap-3">
            <span className="text-sm font-bold flex-1">{selected.size} selected</span>
            <button type="button" onClick={clearSelection} className="text-xs font-semibold text-slate-300 hover:text-white px-2 h-9 cursor-pointer">Clear</button>
            <button type="button" onClick={() => selectedStudents.length && setPicker(selectedStudents)}
              className="h-9 px-5 rounded-full bg-primary text-white text-xs font-bold hover:opacity-90 flex items-center gap-1.5 cursor-pointer">
              <Star size={14} /> Award points
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
