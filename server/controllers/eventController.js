import Event from "../models/Event.js";

/**
 * Utility: Convert IST date+time to UTC Date
 */
const convertISTtoUTC = (date, time) => {
  // date: YYYY-MM-DD
  // time: HH:mm
  const istDate = new Date(`${date}T${time}:00+05:30`);
  return istDate;
};

/**
 * ADD EVENT
 */
export const addEvent = async (req, res) => {
  try {
    const { title, date, time } = req.body;

    if (!title || !date || !time) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Convert IST → UTC
    const dateTimeUTC = convertISTtoUTC(date, time);

    if (isNaN(dateTimeUTC.getTime())) {
      return res.status(400).json({ message: "Invalid date or time" });
    }

    // ✅ Reminder 15 minutes before (UTC-safe)
    const reminderAtUTC = new Date(
      dateTimeUTC.getTime() - 15 * 60 * 1000
    );

    const event = await Event.create({
      title,
      dateTime: dateTimeUTC,
      reminderAt: reminderAtUTC,
      user: req.user.id,
    });

    res.status(201).json(event);
  } catch (error) {
    console.error("Add event error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET EVENTS
 */
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ user: req.user.id }).sort({ dateTime: 1 });
    res.json(events);
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE EVENT
 */
export const deleteEvent = async (req, res) => {
  try {
    const deleted = await Event.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event deleted" });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * UPDATE EVENT
 */
export const updateEvent = async (req, res) => {
  try {
    const { title, date, time } = req.body;

    if (!title || !date || !time) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Convert IST → UTC
    const dateTimeUTC = convertISTtoUTC(date, time);

    if (isNaN(dateTimeUTC.getTime())) {
      return res.status(400).json({ message: "Invalid date or time" });
    }

    const reminderAtUTC = new Date(
      dateTimeUTC.getTime() - 15 * 60 * 1000
    );

    const updatedEvent = await Event.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        title,
        dateTime: dateTimeUTC,
        reminderAt: reminderAtUTC,
        reminderSent: false, // reset reminder
      },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Update event error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
