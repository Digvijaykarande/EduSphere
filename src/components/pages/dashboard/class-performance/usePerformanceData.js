"use client";

// Data layer for Class Performance.
//
// The backend has no performance endpoints yet, so everything is stored in this
// browser's localStorage, scoped per teacher. The teacher defines their own
// categories and marks weightage; nothing is pre-seeded. Every change is a
// read-modify-write against storage, so two open tabs can't overwrite each
// other's awards. Swapping in real API calls later only means changing this file.

import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_SETTINGS, sanitizeSettings, uid } from "./performance.utils";

const keyFor = (ownerId) => `edusphere:class-performance:v2:${ownerId}`;
const legacyKeyFor = (ownerId) => `edusphere:class-performance:v1:${ownerId}`;
const EMPTY = { categories: [], events: [], settings: DEFAULT_SETTINGS };

// v1 pre-filled seven built-in categories. When migrating we drop those that
// the teacher never changed, and keep everything they edited or created.
const V1_BUILTINS = {
  "correct-answer": "Correct Answer|10",
  "attempted-answer": "Attempted Answer|3",
  "voluntary-effort": "Voluntary Effort|2",
  "insightful-question": "Insightful Question|5",
  "peer-support": "Peer Support|5",
  "presentation-lead": "Presentation / Lead|10",
  "punctual-arrival": "Punctual Arrival|2",
};

function parse(raw) {
  try { return JSON.parse(raw); } catch { return null; }
}

function sanitize(p, { migrate = false } = {}) {
  if (!p || typeof p !== "object") return null;
  let categories = (Array.isArray(p.categories) ? p.categories : [])
    .filter((c) => c && c.id && typeof c.label === "string" && Number.isFinite(Number(c.points)))
    .map((c) => ({ id: String(c.id), label: c.label, points: Number(c.points), purpose: c.purpose || "" }));
  if (migrate) categories = categories.filter((c) => V1_BUILTINS[c.id] !== `${c.label}|${c.points}`);
  const events = (Array.isArray(p.events) ? p.events : [])
    .filter((e) => e && e.id && e.studentId && e.ts && Number.isFinite(Number(e.points)))
    .map((e) => ({ ...e, points: Number(e.points) }));
  return { categories, events, settings: sanitizeSettings(p.settings) };
}

function readStore(ownerId) {
  try {
    const raw = window.localStorage.getItem(keyFor(ownerId));
    if (raw) return sanitize(parse(raw));
    const old = window.localStorage.getItem(legacyKeyFor(ownerId));
    if (old) return sanitize(parse(old), { migrate: true });
  } catch {
    /* storage blocked: caller falls back to in-memory state */
  }
  return null;
}

export function usePerformanceData(ownerId) {
  const [data, setData] = useState(EMPTY);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const dataRef = useRef(EMPTY);

  const commit = useCallback((next) => {
    dataRef.current = next;
    setData(next);
  }, []);

  // Load once the owner is known.
  useEffect(() => {
    if (!ownerId) return;
    commit(readStore(ownerId) ?? EMPTY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(true);
  }, [ownerId, commit]);

  // Keep other open tabs in sync.
  useEffect(() => {
    if (!ownerId) return;
    const onStorage = (e) => {
      if (e.key !== null && e.key !== keyFor(ownerId)) return;
      commit(readStore(ownerId) ?? EMPTY);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [ownerId, commit]);

  const mutate = useCallback((fn) => {
    if (!ownerId) return;
    const next = fn(readStore(ownerId) ?? dataRef.current);
    try {
      window.localStorage.setItem(keyFor(ownerId), JSON.stringify(next));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
    commit(next);
  }, [ownerId, commit]);

  const addEvents = useCallback((entries) => {
    const ts = new Date().toISOString();
    const created = entries.map((e) => ({ id: uid(), ts, ...e }));
    mutate((d) => ({ ...d, events: [...d.events, ...created] }));
    return created;
  }, [mutate]);

  const removeEvents = useCallback((ids) => {
    const set = new Set(ids);
    mutate((d) => ({ ...d, events: d.events.filter((e) => !set.has(e.id)) }));
  }, [mutate]);

  const restoreEvents = useCallback((list) => {
    mutate((d) => {
      const have = new Set(d.events.map((e) => e.id));
      return { ...d, events: [...d.events, ...list.filter((e) => !have.has(e.id))] };
    });
  }, [mutate]);

  const saveCategory = useCallback((cat) => {
    const saved = { id: cat.id || uid(), label: cat.label.trim(), points: Number(cat.points), purpose: (cat.purpose || "").trim() };
    mutate((d) => {
      const exists = d.categories.some((c) => c.id === saved.id);
      return {
        ...d,
        categories: exists ? d.categories.map((c) => (c.id === saved.id ? saved : c)) : [...d.categories, saved],
      };
    });
    return saved;
  }, [mutate]);

  // Past awards keep their label and points; they just stop pointing at the removed category.
  const deleteCategory = useCallback((id) => {
    mutate((d) => ({
      ...d,
      categories: d.categories.filter((c) => c.id !== id),
      events: d.events.map((e) => (e.categoryId === id ? { ...e, categoryId: null } : e)),
    }));
  }, [mutate]);

  const saveSettings = useCallback((settings) => {
    mutate((d) => ({ ...d, settings: sanitizeSettings(settings) }));
  }, [mutate]);

  return {
    ready,
    categories: data.categories,
    events: data.events,
    settings: data.settings,
    storageError,
    addEvents,
    removeEvents,
    restoreEvents,
    saveCategory,
    deleteCategory,
    saveSettings,
  };
}
