import cron from "node-cron";
import transporter from "../config/mailer.js";
import Event from "../models/Event.js";

let cronStarted = false;

const startReminderCron = () => {
  if (cronStarted) return;
  cronStarted = true;

  cron.schedule(
    "* * * * *", // every minute
    async () => {
      try {
        const now = new Date();
        
        const events = await Event.find({
          reminderAt: { $lte: now },
          reminderSent: false,
        }).populate("user");

        for (const event of events) {
          if (!event.user?.email) {
            console.log("Skipping event without user/email");
            continue;
          }

          await transporter.sendMail({
            from: `"Event Reminder" <${process.env.EMAIL_USER}>`,
            to: event.user.email,
            subject: `⏰ Reminder: ${event.title}`,
            html: `
              <div style="font-family:Arial;padding:12px">
                <h2>${event.title}</h2>
                <p><b>Event Time:</b> ${event.dateTime.toLocaleString()}</p>
                <p>⏰ This is your scheduled reminder.</p>
              </div>
            `,
          });

          event.reminderSent = true;
          await event.save();
        }

        if (events.length) {
          console.log(`Sent ${events.length} reminder(s)`);
        }
      } catch (error) {
        console.error("Cron error FULL:", error);
      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );
};

export default startReminderCron;
