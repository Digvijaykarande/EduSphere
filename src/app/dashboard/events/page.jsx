"use client";

import React, { useMemo, useState } from "react";
import EventsHeader from "@/components/pages/dashboard/events/EventsHeader";
import CalendarToolbar from "@/components/pages/dashboard/events/CalendarToolbar";
import CalendarViews from "@/components/pages/dashboard/events/CalendarViews";
import EventPanels from "@/components/pages/dashboard/events/EventPanels";
import EventModal from "@/components/pages/dashboard/events/EventModal";
import {
  CATEGORY_LIST,
  seedEvents,
  emptyDraft,
  toKey,
  addMonths,
  addDays,
  startOfWeek,
  buildMonthGrid,
} from "@/components/pages/dashboard/events/events.utils";

export default function EventsPage() {
  const today = new Date();

  const [events, setEvents] = useState(seedEvents);
  const [activeCategories] = useState(
    Object.fromEntries(CATEGORY_LIST.map((c) => [c, true]))
  );
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(today);
  const [activeTab, setActiveTab] = useState("month");
  const [modalDate, setModalDate] = useState(null);
  const [draft, setDraft] = useState(emptyDraft);

  const filteredEvents = useMemo(
    () => events.filter((e) => activeCategories[e.category]),
    [events, activeCategories]
  );

  const eventsByDate = useMemo(() => {
    const map = {};
    filteredEvents.forEach((e) => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return map;
  }, [filteredEvents]);

  const upcoming = useMemo(() => {
    return filteredEvents
      .filter((e) => e.date >= toKey(today))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 4);
  }, [filteredEvents]);

  const todaysEvents = useMemo(
    () => (eventsByDate[toKey(today)] || []).sort((a, b) => a.start.localeCompare(b.start)),
    [eventsByDate]
  );

  const monthGrid = useMemo(() => buildMonthGrid(viewDate), [viewDate]);
  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDate);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [selectedDate]);

  function shiftMonth(delta) {
    setViewDate((prev) => addMonths(prev, delta));
  }

  function shiftWeekOrDay(delta) {
    if (activeTab === "day") {
      setSelectedDate(addDays(selectedDate, delta));
    } else if (activeTab === "week") {
      setSelectedDate(addDays(selectedDate, delta * 7));
    } else {
      shiftMonth(delta);
    }
  }

  function goToday() {
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  }

  function openModal(date) {
    setSelectedDate(date);
    setModalDate(date);
    setDraft(emptyDraft);
  }

  function closeModal() {
    setModalDate(null);
    setDraft(emptyDraft);
  }

  function handleAddEvent(e) {
    e.preventDefault();
    if (!draft.title.trim() || !modalDate) return;
    setEvents((prev) => [
      ...prev,
      {
        id: `e${Date.now()}`,
        title: draft.title.trim(),
        date: toKey(modalDate),
        start: draft.start || "All day",
        end: draft.end,
        location: draft.location || "TBD",
        category: draft.category,
      },
    ]);
    setDraft(emptyDraft);
    closeModal();
  }

  function deleteEvent(id) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  function exportEvents() {
    const blob = new Blob([JSON.stringify(events, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "edusphere-events.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 pb-12">
      <EventsHeader
        exportEvents={exportEvents}
        openModal={openModal}
        selectedDate={selectedDate}
      />

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
        <CalendarToolbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          goToday={goToday}
          shiftWeekOrDay={shiftWeekOrDay}
        />

        <CalendarViews
          activeTab={activeTab}
          monthGrid={monthGrid}
          weekDays={weekDays}
          eventsByDate={eventsByDate}
          filteredEvents={filteredEvents}
          viewDate={viewDate}
          selectedDate={selectedDate}
          today={today}
          openModal={openModal}
          deleteEvent={deleteEvent}
        />
      </div>

      <EventPanels
        upcoming={upcoming}
        todaysEvents={todaysEvents}
        setActiveTab={setActiveTab}
        openModal={openModal}
        today={today}
      />

      <EventModal
        modalDate={modalDate}
        closeModal={closeModal}
        eventsByDate={eventsByDate}
        deleteEvent={deleteEvent}
        handleAddEvent={handleAddEvent}
        draft={draft}
        setDraft={setDraft}
      />
    </div>
  );
}