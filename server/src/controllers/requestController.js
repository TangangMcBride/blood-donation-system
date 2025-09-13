
import BloodRequest from "../models/BloodRequest.js";
import { findCompatibleDonors } from "../utils/machingEngine.js";
import { sendNotification } from "../utils/notification.js";

async function createRequest(req, res) {
  const { patientName, bloodType, quantity, urgency, location } = req.body;
  const requesterId = req.user._id;
  const requesterRole = req.user.role === "Hospital" ? "Hospital" : "Patient";
  const request = new BloodRequest({ requesterId, requesterRole, patientName, bloodType, quantity, urgency });
  if (location && Array.isArray(location.coordinates)) request.location = location;
  await request.save();

  // find donors and notify (simple)
  const donors = await findCompatibleDonors({ bloodType, location: request.location, maxResults: 10, radiusMeters: urgency === "Urgent" ? 50000 : 100000 });
  request.matchedDonors = donors.map(d => d._id);
  await request.save();

  // send notifications (fire-and-forget)
  donors.forEach(donor => {
    sendNotification({ recipient: donor, message: `Urgent: ${bloodType} needed (${quantity})` }).catch(console.error);
  });

  res.status(201).json({ request, notified: donors.length });
}

export { createRequest };



