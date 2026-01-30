import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const PastEvents = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const splitDateTime = (dateTime) => {
    const d = new Date(dateTime);
    return {
      date: d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }),
      time: d.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
      }),
    };
  };

  const fetchPastEvents = async () => {
    try {
      const res = await api.get("/events");

      const past = res.data
        .filter((e) => e.reminderSent === true && e.dateTime)
        .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

      setEvents(past);
    } catch (err) {
      console.error("Failed to fetch past events", err);
    }
  };

  useEffect(() => {
    fetchPastEvents();
  }, []);

  /* ================= DELETE EVENT ================= */
  const deleteEvent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/events/${id}`);
      fetchPastEvents();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white px-4 sm:px-6 lg:px-10 py-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <h1
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold
          text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500"
        >
          🕒 Past Events
        </h1>

        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 sm:px-6 py-2 rounded-lg
            border border-indigo-200 text-indigo-600
            hover:bg-indigo-50 transition"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* EVENTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {events.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center">
            No past events yet
          </p>
        ) : (
          events.map((e) => {
            const { date, time } = splitDateTime(e.dateTime);

            return (
              <div
                key={e._id}
                className="relative rounded-2xl p-[1px]
                  bg-gradient-to-r from-indigo-400 to-blue-400
                  hover:scale-[1.03] transition"
              >
                <div className="bg-white rounded-2xl p-5 shadow-sm border">
                  {/* COMPLETED BADGE */}
                  <span
                    className="absolute top-3 right-3 text-xs
                    bg-green-500 text-white px-3 py-1 rounded-full"
                  >
                    ✅ Completed
                  </span>

                  <h3 className="text-lg sm:text-xl font-bold line-through text-gray-400">
                    {e.title}
                  </h3>

                  <p className="mt-2 text-gray-600 text-sm sm:text-base">
                    📅 {date}
                  </p>
                  <p className="text-gray-600 text-sm sm:text-base">
                    ⏰ {time}
                  </p>

                  {/* ACTIONS */}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => deleteEvent(e._id)}
                      className="px-4 py-2 text-sm font-semibold
                        text-red-500 border border-red-200
                        rounded-lg hover:bg-red-50 transition"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PastEvents;
