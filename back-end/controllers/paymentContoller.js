import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY);

const createPaymentSetting = async (req, res) => {
  try {
    const { amount, currency, description } = req.body;

    // Validazione dei dati
    if (!amount || !currency || !description) {
      return res.status(400).json({ error: 'Parametri mancanti nel corpo della richiesta.' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      description,
      payment_method_types: ['card'],
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });

  } catch (error) {
    console.error("Errore nella creazione del pagamento:", error.message);

    res.status(500).json({
      error: 'Errore nella creazione del pagamento',
      details: error.message,
    });
  }
};

export default createPaymentSetting;
