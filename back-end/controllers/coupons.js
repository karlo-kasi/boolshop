import nodemailer from "nodemailer";

// opzionale: implementa una semplice cache in memoria
const emailCache = new Map();

async function sendEmailCoupon(email) {
  let transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "a4c6d90d79beb2",
      pass: "87232abbc07d92",
    },
  });

  let htmlContent = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 12px; background-color: #f9f9f9; font-family: sans-serif; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #2c3e50;">Il tuo codice sconto BoolShop!</h2>
      <p style="font-size: 16px; color: #333;">
        Grazie per esserti iscritto alla nostra newsletter, potrai ricevere notifiche su nuovi articoli!
        In più, ecco un codice sconto del <strong>10%</strong> sul tuo prossimo acquisto!
      </p>
      <div style="margin: 20px 10px; padding: 12px; background-color: #e1f5e9; border: 1px dashed #2ecc71; text-align: center; font-size: 24px; font-weight: bold; color: #27ae60; border-radius: 8px;">
        cover10
      </div>
      <p style="font-size: 20px; color: #333; text-align: center">Buono shopping!</p>
      <div class="footer" style="margin-top: 20px; text-align: center; font-size: 14px; color: #777;">
        <p>Se hai domande o hai bisogno di assistenza, non esitare a contattarci.</p>
        <p>BoolShop - Il tuo negozio online di fiducia.</p>
        <img src="http://localhost:3000/boolshop-logo.svg" alt="Logo BoolShop" style="width: 100px; height: auto; margin-top: 10px; text-align: center" />
      </div>
    </div>
  `;

  let mailOptions = {
    from: '"BoolShop" <info@boolshop.com>',
    to: email,
    subject: "Il tuo codice sconto BoolShop!",
    html: htmlContent
  };

  return transporter.sendMail(mailOptions); // restituisce una Promise
}

async function sendCoupon(req, res) {
  const { email } = req.body;

  // Validazione email
  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email non valida" });
  }

  // Controllo cache (opzionale)
  if (emailCache.has(email)) {
    return res.status(429).json({ error: "Email già inviata a questo indirizzo" });
  }

  try {
    await sendEmailCoupon(email);
    emailCache.set(email, true);
    res.status(200).json({ message: "Coupon inviato via email!" });
  } catch (error) {
    console.error("Errore nell'invio dell'email:", error);
    res.status(500).json({ error: "Errore nell'invio dell'email" });
  }
}

export default sendCoupon;
