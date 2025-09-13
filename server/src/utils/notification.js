async function sendNotification({ recipient, message }) {
  // In production, integrate Twilio / SendGrid / Firebase
  console.log(`NOTIFICATION to ${recipient.email || recipient.phone}: ${message}`);
  // Simulate delivery
  return { ok: true };
}


export { sendNotification };
