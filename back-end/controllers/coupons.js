import nodemailer from "nodemailer";

// opzionale: implementa una semplice cache in memoria
const emailCache = new Map();

async function sendEmailCoupon(email) {
  let transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "c4b706acf77fab",
      pass: "26b215ce533dec",
    },
  });

  let htmlContent = `
    <p>Grazie per esserti registrato su BoolShop!</p>
    <p>Usa il codice sconto <strong>cover10</strong> per ottenere uno sconto del 10% sul tuo prossimo ordine.</p>
    <p>Buono shopping!</p>
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
