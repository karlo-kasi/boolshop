import Stripe from 'stripe';

const testStripe = Stripe(process.env.STRIPE_TEST_SECRET_KEY); 

const createPaymentSetting = (req, res) => {
    // Validazione dei dati del pagamaneto
    const { amount, currency, description } = req.body;
    const paymentIntent = testStripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        description: description,
        payment_method_types: ['card'],
    })
    .then((paymentIntent) => {
        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    })
    .catch((error) => {
        console.error("Errore nella creazione del pagamento:", error);
        res.status(500).json({ error: 'Errore nella creazione del pagamento' });
    });

    
}


export default createPaymentSetting;
