import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "c4b706acf77fab",
    pass: "26b215ce533dec",
  },
});

function sendCoupon(req, res) {
  const { email } = req.body;

  // Validazione email
  if (!email) {
    return res.status(400).json({ error: "Email non valida" });
  }

  const mailOptions = {
    from: '"BoolShop" <info@boolshop.com>',
    to: email,
    subject: "Il tuo codice sconto BoolShop!",
    html: `
      <p>Grazie per esserti registrato su BoolShop!</p>
      <p>Usa il codice sconto <strong>cover10</strong> per ottenere uno sconto del 10% sul tuo prossimo ordine.</p>
      <p>Buono shopping!</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Errore nell'invio dell'email:", error);
      return res.status(500).json({ error: "Errore nell'invio dell'email" });
    }

    emailCache.set(email, true); // Salva in cache per bloccare invii futuri
    res.status(200).json({ message: "Coupon inviato via email!" });
  });
}

export default sendCoupon;
