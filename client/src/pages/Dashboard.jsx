import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const Dashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("calendar");

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [editId, setEditId] = useState(null);
  const [events, setEvents] = useState([]);

  /* ================= FETCH EVENTS ================= */
  const fetchEvents = async () => {
    const res = await api.get("/events");
    setEvents(res.data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  /* ================= ADD / UPDATE EVENT ================= */
  const saveEvent = async (e) => {
    e.preventDefault();
    if (!title || !date || !time) return;

    if (editId) {
      await api.put(`/events/${editId}`, { title, date, time });
    } else {
      await api.post("/events", { title, date, time });
    }

    setTitle("");
    setDate("");
    setTime("");
    setEditId(null);

    fetchEvents();
    setActiveTab("upcoming");
  };

  /* ================= DELETE EVENT ================= */
  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    await api.delete(`/events/${id}`);
    fetchEvents();
  };

  /* ================= LOGOUT ================= */
  const logout = async () => {
    await api.post("/auth/logout");
    navigate("/");
  };

  /* ================= CALENDAR EVENTS ================= */
  const calendarEvents = events.map((e) => ({
    title: e.title,
    date: e.dateTime.split("T")[0],
    display: "background",
    backgroundColor: e.reminderSent ? "#22c55e" : "#3b82f6",
    borderColor: e.reminderSent ? "#22c55e" : "#3b82f6",
  }));

  const upcomingEvents = events
    .filter((e) => !e.reminderSent)
    .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white px-4 sm:px-6 lg:px-10 py-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
          📅 Event Dashboard
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/past-events")}
            className="px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition"
          >
            Past Events
          </button>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-3 mb-8">
        {["add", "calendar", "upcoming"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full font-semibold transition
              ${
                activeTab === tab
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              }`}
          >
            {tab === "add" && "➕ Add Event"}
            {tab === "calendar" && "📆 Calendar"}
            {tab === "upcoming" && "📋 Upcoming"}
          </button>
        ))}
      </div>

      {/* ADD / UPDATE EVENT */}
      {activeTab === "add" && (
        <div className="max-w-md mx-auto bg-white rounded-2xl p-6 shadow border">
          <h2 className="text-xl font-bold mb-5 text-center">
            {editId ? "Update Event" : "Add New Event"}
          </h2>

          <form onSubmit={saveEvent} className="space-y-4">
            <input
              placeholder="Event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-400"
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-400"
            />

            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-400"
            />

            <button className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-500 hover:scale-105 transition">
              {editId ? "Update Event" : "Save Event"}
            </button>
          </form>
        </div>
      )}

      {/* CALENDAR */}
      {activeTab === "calendar" && (
        <div className="max-w-5xl mx-auto bg-white rounded-2xl p-6 shadow border">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={calendarEvents}
            fixedWeekCount={false}
            height="auto"
            headerToolbar={{
              left: "prev",
              center: "title",
              right: "next",
            }}
            eventDidMount={(info) => {
              info.el.title = info.event.title;
            }}
            dateClick={(info) => {
              setDate(info.dateStr);
              setActiveTab("add");
            }}
          />
        </div>
      )}

      {/* UPCOMING EVENTS */}
      {activeTab === "upcoming" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center">
              No upcoming events
            </p>
          ) : (
            upcomingEvents.map((e) => (
              <div
                key={e._id}
                className="rounded-2xl p-[1px] bg-gradient-to-r from-indigo-400 to-blue-400 hover:scale-[1.03] transition"
              >
                <div className="bg-white rounded-2xl p-5 shadow">
                  <h3 className="font-bold text-gray-800">{e.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    📅 {new Date(e.dateTime).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    ⏰{" "}
                    {new Date(e.dateTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => {
                        setEditId(e._id);
                        setTitle(e.title);
                        setDate(e.dateTime.split("T")[0]);
                        setTime(
                          new Date(e.dateTime)
                            .toLocaleTimeString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                        );
                        setActiveTab("add");
                      }}
                      className="px-4 py-2 text-sm rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                    >
                      Update
                    </button>

                    <button
                      onClick={() => deleteEvent(e._id)}
                      className="px-4 py-2 text-sm rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* DARK DATE STYLE */}
      <style>
        {`
          .fc-daygrid-day-number {
            font-weight: 600;
            color: #333941;
          }
          .fc-col-header-cell-cushion {
            font-weight: 600;
            color: #1a1d22;
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;
