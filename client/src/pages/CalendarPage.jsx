import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import api from "../api/axios";

const CalendarPage = () => {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events");

      const calendarEvents = res.data
        .filter((e) => e.dateTime)
        .map((e) => ({
          id: e._id,
          title: e.title,
          start: e.dateTime,
          backgroundColor: e.reminderSent ? "#22c55e" : "#3b82f6",
          borderColor: e.reminderSent ? "#16a34a" : "#2563eb",
          textColor: "#ffffff",
        }));

      setEvents(calendarEvents);
    } catch (err) {
      console.error("Calendar fetch failed", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white px-4 sm:px-8 py-6">
      {/* HEADER */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-400 mb-8 text-center">
        📅 Event Calendar
      </h1>

      {/* CALENDAR CARD */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 shadow-xl">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          height="auto"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek,dayGridDay",
          }}
          dayMaxEventRows={3}
          eventDisplay="block"
        />
      </div>
    </div>
  );
};

export default CalendarPage;
