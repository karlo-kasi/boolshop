import { useState, useEffect } from "react";
import axios from "axios";
import { data, useNavigate } from "react-router-dom";
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';

export default function Checkout() {
    const navigate = useNavigate();

    const initalData = {
        name: "",
        surname: "",
        email: "",
        shipping_address: "",
        city: "",
        province: "",
        zip: "",
        phone_number: "",
    };

    const [cart, setCart] = useState([]);
    const [formData, setFormData] = useState(initalData);
    const [isFormValid, setIsFormValid] = useState(true);
    const [errors, setErrors] = useState({
        name: "",
        surname: "",
        email: "",
        shipping_address: "",
        city: "",
        province: "",
        zip: "",
        phone_number: "",
    });

    const stripe = useStripe();
    const elements = useElements();

    const [clientSecret, setClientSecret] = useState("");
    const [paymentError, setPaymentError] = useState('');
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const [isLoading, setIsLoading] = useState(false);


    const submitOrder = async (dataToSubmit) => {
        try {
            const response = await axios.post("http://localhost:3000/cover/order", dataToSubmit, {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log("Order Response:", response.data);
            // Azioni in caso di successo: svuotare il carrello, resettare il form, reindirizzare l'utente, ecc.
            localStorage.removeItem("cartItems");
            setCart([]);
            setFormData(initalData);
            navigate("/thank-you");
        } catch (error) {
            console.error("Errore nell'invio dell'ordine:", error);
            setIsFormValid(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Costruisci l'indirizzo di spedizione combinando i vari campi
        const shippingAddress = `${formData.shipping_address}, ${formData.city}, ${formData.province}, ${formData.zip}`;

        // Prepara i dati dell'ordine da inviare al backend
        const dataToSubmit = {
            ...formData,
            shipping_address: shippingAddress,
            billing_address: shippingAddress,
            coupon_id: 1,
            products: productsToSend,
        };

        // Primo step: gestisci il pagamento
        setIsLoading(true)
        const paymentSuccessful = await handlePayment();
        setIsLoading(false)

        if (paymentSuccessful) {
            // Se il pagamento va a buon fine, invia l'ordine
            await submitOrder(dataToSubmit);
        } else {
            // Gestisci il caso in cui il pagamento fallisca (ad es. mostra un messaggio di errore)
            console.error("Il pagamento non è andato a buon fine. L'ordine non verrà inviato.");
        }
    };


    //validazione dei campi
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Aggiorna il valore del form
        setFormData({
            ...formData,
            [name]: value,
        });

        // Aggiorna gli errori in modo che non sovrascrivano quelli esistenti
        setErrors(() => {
            const newErrors = { ...errors };

            if (name === "name") {
                if (value.length < 3) {
                    newErrors.name = "Il nome deve essere lungo almeno 3 caratteri.";
                } else {
                    newErrors.name = ""; // Rimuove l'errore se la condizione è soddisfatta
                }
            }

            if (name === "surname") {
                if (value.length < 3) {
                    newErrors.surname = "Il cognome deve essere lungo almeno 3 caratteri.";
                } else {
                    newErrors.surname = ""; // Rimuove l'errore se la condizione è soddisfatta
                }
            }

            if (name === "email") {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(value)) {
                    newErrors.email = "Inserisci un'email valida.";
                } else {
                    newErrors.email = ""; // Rimuove l'errore se la condizione è soddisfatta
                }
            }

            if (name === "phone_number") {
                const phonePattern = /^\d{10}$/; // Modifica il pattern in base al formato desiderato
                if (!phonePattern.test(value)) {
                    newErrors.phone_number = "Il numero di telefono deve essere lungo 10 cifre.";
                } else {
                    newErrors.phone_number = ""; // Rimuove l'errore se la condizione è soddisfatta
                }
            }

            if (name === "shipping_address") {
                if (value.length < 5) {
                    newErrors.shipping_address = "L'indirizzo deve essere lungo almeno 5 caratteri.";
                } else {
                    newErrors.shipping_address = ""; // Rimuove l'errore se la condizione è soddisfatta
                }
            }

            if (name === "city") {
                if (value.length < 3) {
                    newErrors.city = "La città deve essere lunga almeno 3 caratteri.";
                } else {
                    newErrors.city = ""; // Rimuove l'errore se la condizione è soddisfatta
                }
            }

            if (name === "zip") {
                const zipPattern = /^\d{5}$/; // Modifica il pattern in base al formato desiderato
                if (!zipPattern.test(value)) {
                    newErrors.zip = "Il CAP deve essere lungo 5 cifre.";
                } else {
                    newErrors.zip = ""; // Rimuove l'errore se la condizione è soddisfatta
                }
            }

            if (name === "province") {
                if (value === "") {
                    newErrors.province = "Seleziona una provincia.";
                } else {
                    newErrors.province = ""; // Rimuove l'errore se la condizione è soddisfatta
                }
            }


            return newErrors;
        });
    };


    //Logica per il pagamaneto 
    // Funzione per gestire il pagamento
    const handlePayment = async () => {
        if (!stripe || !elements) return false;

        const cardNumber = elements.getElement(CardNumberElement);
        const cardExpiry = elements.getElement(CardExpiryElement);
        const cardCvc = elements.getElement(CardCvcElement);

        if (!cardNumber || !cardExpiry || !cardCvc) {
            console.error("Uno dei campi della carta non è stato trovato.");
            return false;
        }

        try {
            const response = await axios.post("http://localhost:3000/cover/payment", {
                amount: amountInCents,
                currency: "eur",
                description: "Acquisto prodotti",
            });

            const clientSecret = response.data.clientSecret;
            setClientSecret(clientSecret);

            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardNumber,
                    billing_details: {
                        name: `${formData.name} ${formData.surname}`,
                        email: formData.email,
                        phone: formData.phone_number,
                    },
                },
            });

            if (error) {
                console.error("Errore nel pagamento:", error.message);
                setPaymentError(error.message);
                return false;
            } else {
                console.log("Pagamento completato:", paymentIntent);
                setPaymentSuccess(true);
                return true;
            }
        } catch (error) {
            console.error("Errore durante la creazione del pagamento:", error);
            setPaymentError("Errore nella creazione del pagamento");
            return false;
        }
    };




    // Recupera il carrello dal localStorage all'avvio
    useEffect(() => {
        const storedCart = localStorage.getItem("cartItems");
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, []);



    // Calcola il totale e prepara i prodotti da inviare all'ordine
    let totalPrice = 0;
    let totalQuantity = 0;
    const productsToSend = cart.map((product) => {
        totalPrice += parseFloat(product.price) * product.quantity;
        totalQuantity += product.quantity;
        return {
            product_id: product.id,
            quantity: product.quantity,
        };
    });
    // Stripe richiede l'importo in centesimi come intero
    const amountInCents = Math.round(totalPrice * 100);




    return (
        <>
            <div className="container my-5">
                <main>
                    <div className="row g-5">
                        <div className="col-md-5 col-lg-4 order-md-last">
                            <h4 className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-primary">Carrello</span>
                                <span className="badge bg-primary rounded-pill">{totalQuantity}</span>
                            </h4>

                            <ul className="list-group mb-3">
                                {
                                    cart.map(product => {
                                        return (
                                            <li key={product.id} className="list-group-item d-flex justify-content-between lh-sm">
                                                <div>
                                                    <h6 className="my-0">{product.name}</h6>
                                                </div>
                                                <span className="text-body-secondary">{product.quantity} x {product.price}&euro;</span>
                                                <img src={product.image} width="20px" alt="" />
                                            </li>
                                        )
                                    }
                                    )}
                                {
                                    totalPrice < 29.99 ? (
                                        <li className="list-group-item d-flex justify-content-between lh-sm">
                                            <div>
                                                <h6 className="my-0">Costi di spedizione</h6>
                                            </div>
                                            <span className="text-body-secondary">13&euro;</span>
                                        </li>
                                    ) : (
                                        <li className="list-group-item d-flex justify-content-between lh-sm">
                                            <div>
                                                <h6 className="my-0">Spedizione gratuita</h6>
                                            </div>
                                            <span className="text-body-secondary"></span>
                                        </li>
                                    )
                                }
                                {/*<li className="list-group-item d-flex justify-content-between bg-body-tertiary">
                                    <div className="text-success">
                                        <h6 className="my-0">Promo code</h6>
                                        <small>EXAMPLECODE</small>
                                    </div>
                                    <span className="text-success">−$5</span>
                                </li>*/}
                                <li className="list-group-item d-flex justify-content-between">
                                    <span>Totale</span>
                                    {totalPrice < 29.99 ? <span className="text-body-secondary">{(parseFloat(totalPrice) + 13.00).toFixed(2)}&euro;</span>
                                        : <span className="text-success">{totalPrice}&euro;</span>}
                                </li>
                            </ul>

                            {/*<form className="card p-2">
                                <div className="input-group">
                                    <input type="text" className="form-control" placeholder="Promo code" />
                                    <button type="submit" className="btn btn-secondary">Redeem</button>
                                </div>
                            </form>*/}
                        </div>

                        <div className="col-md-7 col-lg-8">
                            <h4 className="mb-1">Inserisci i tuoi dati</h4>
                            {/* Aggiungi noValidate per disabilitare la validazione HTML di default */}
                            <form className="needs-validation" onSubmit={handleSubmit} noValidate>
                                {!isFormValid && (
                                    <div className="alert alert-danger" role="alert">
                                        *Tutti i campi sono obbligatori.
                                    </div>)}
                                <div className="row g-3">
                                    <div className="col-sm-6">
                                        <label htmlFor="firstName" className="form-label">Nome</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            id="firstName"
                                            placeholder=""
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                        <div className="invalid-feedback">
                                            Scrivi un nome valido.
                                        </div>

                                    </div>

                                    <div className="col-sm-6">
                                        <label htmlFor="lastName" className="form-label">Cognome</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.surname ? 'is-invalid' : ''}`}
                                            id="lastName"
                                            placeholder=""
                                            name="surname"
                                            value={formData.surname}
                                            onChange={handleChange}
                                            required
                                        />
                                        <div className="invalid-feedback">
                                            Scrivi un cognome valido.
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <label htmlFor="email" className="form-label">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            id="email"
                                            placeholder="you@example.com"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                        <div className="invalid-feedback">
                                            Scrivi un indirizzo email valido.
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <label htmlFor="phone_number" className="form-label">
                                            Telefono
                                        </label>
                                        <input
                                            type="tel"
                                            className={`form-control ${errors.phone_number ? 'is-invalid' : ''}`}
                                            id="phone_number"
                                            placeholder="3333333333"
                                            name="phone_number"
                                            value={formData.phone_number}
                                            onChange={handleChange}
                                            required
                                        />
                                        <div className="invalid-feedback">
                                            Scrivi un numero di telefono valido.
                                        </div>
                                    </div>


                                    <div className="col-12">
                                        <label htmlFor="shipping_address" className="form-label">Indirizzo</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.shipping_address ? 'is-invalid' : ''}`}
                                            id="shipping_address"
                                            placeholder="1234 Main St"
                                            name="shipping_address"
                                            value={formData.shipping_address}
                                            onChange={handleChange}
                                            required
                                        />
                                        <div className="invalid-feedback">
                                            Scrivi un indirizzo valido.
                                        </div>
                                    </div>



                                    <div className="col-md-3">
                                        <label htmlFor="city" className="form-label">Città</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                                            id="city"
                                            placeholder=""
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                        />
                                        <div className="invalid-feedback">
                                            Scrivi una città valida.
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <label htmlFor="zip" className="form-label">CAP</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.zip ? 'is-invalid' : ''}`}
                                            id="zip"
                                            placeholder=""
                                            name="zip"
                                            value={formData.zip}
                                            onChange={handleChange}
                                            required
                                        />
                                        <div className="invalid-feedback">
                                            Il CAP è obbligatorio.
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <label htmlFor="province" className={`form-label ${errors.province ? 'is-invalid' : ''}`}>Provincia</label>
                                        <select
                                            className="form-select"
                                            id="province"
                                            name="province"
                                            value={formData.province}
                                            onChange={handleChange}
                                            required>
                                            <option value="">Choose...</option>
                                            <option value="AG">Agrigento (AG)</option>
                                            <option value="AL">Alessandria (AL)</option>
                                            <option value="AN">Ancona (AN)</option>
                                            <option value="AO">Aosta (AO)</option>
                                            <option value="AR">Arezzo (AR)</option>
                                            <option value="AP">Ascoli Piceno (AP)</option>
                                            <option value="AT">Asti (AT)</option>
                                            <option value="AV">Avellino (AV)</option>
                                            <option value="BA">Bari (BA)</option>
                                            <option value="BT">Barletta-Andria-Trani (BT)</option>
                                            <option value="BL">Belluno (BL)</option>
                                            <option value="BN">Benevento (BN)</option>
                                            <option value="BG">Bergamo (BG)</option>
                                            <option value="BI">Biella (BI)</option>
                                            <option value="BO">Bologna (BO)</option>
                                            <option value="BZ">Bolzano (BZ)</option>
                                            <option value="BS">Brescia (BS)</option>
                                            <option value="BR">Brindisi (BR)</option>
                                            <option value="CA">Cagliari (CA)</option>
                                            <option value="CB">Campobasso (CB)</option>
                                            <option value="CE">Caserta (CE)</option>
                                            <option value="CT">Catania (CT)</option>
                                            <option value="CZ">Catanzaro (CZ)</option>
                                            <option value="CH">Chieti (CH)</option>
                                            <option value="CO">Como (CO)</option>
                                            <option value="CS">Cosenza (CS)</option>
                                            <option value="CR">Cremona (CR)</option>
                                            <option value="KR">Crotone (KR)</option>
                                            <option value="CN">Cuneo (CN)</option>
                                            <option value="EN">Enna (EN)</option>
                                            <option value="FM">Fermo (FM)</option>
                                            <option value="FE">Ferrara (FE)</option>
                                            <option value="FI">Firenze (FI)</option>
                                            <option value="FG">Foggia (FG)</option>
                                            <option value="FC">Forlì-Cesena (FC)</option>
                                            <option value="FR">Frosinone (FR)</option>
                                            <option value="GE">Genova (GE)</option>
                                            <option value="GO">Gorizia (GO)</option>
                                            <option value="GR">Grosseto (GR)</option>
                                            <option value="IM">Imperia (IM)</option>
                                            <option value="IS">Isernia (IS)</option>
                                            <option value="SP">La Spezia (SP)</option>
                                            <option value="LT">Latina (LT)</option>
                                            <option value="LE">Lecce (LE)</option>
                                            <option value="LC">Lecco (LC)</option>
                                            <option value="LI">Livorno (LI)</option>
                                            <option value="LO">Lodi (LO)</option>
                                            <option value="LU">Lucca (LU)</option>
                                            <option value="MC">Macerata (MC)</option>
                                            <option value="MN">Mantova (MN)</option>
                                            <option value="MS">Massa-Carrara (MS)</option>
                                            <option value="MT">Matera (MT)</option>
                                            <option value="VS">Medio Campidano (VS)</option>
                                            <option value="ME">Messina (ME)</option>
                                            <option value="MI">Milano (MI)</option>
                                            <option value="MO">Modena (MO)</option>
                                            <option value="MB">Monza e della Brianza (MB)</option>
                                            <option value="NA">Napoli (NA)</option>
                                            <option value="NO">Novara (NO)</option>
                                            <option value="NU">Nuoro (NU)</option>
                                            <option value="OR">Oristano (OR)</option>
                                            <option value="PD">Padova (PD)</option>
                                            <option value="PA">Palermo (PA)</option>
                                            <option value="PR">Parma (PR)</option>
                                            <option value="PV">Pavia (PV)</option>
                                            <option value="PG">Perugia (PG)</option>
                                            <option value="PU">Pesaro e Urbino (PU)</option>
                                            <option value="PE">Pescara (PE)</option>
                                            <option value="PI">Pisa (PI)</option>
                                            <option value="PT">Pistoia (PT)</option>
                                            <option value="PN">Pordenone (PN)</option>
                                            <option value="PR">Potenza (PR)</option>
                                            <option value="RG">Ragusa (RG)</option>
                                            <option value="RA">Ravenna (RA)</option>
                                            <option value="RC">Reggio Calabria (RC)</option>
                                            <option value="RE">Reggio Emilia (RE)</option>
                                            <option value="RI">Rieti (RI)</option>
                                            <option value="RN">Rimini (RN)</option>
                                            <option value="RM">Roma (RM)</option>
                                            <option value="RO">Rovigo (RO)</option>
                                            <option value="SA">Salerno (SA)</option>
                                            <option value="SS">Sassari (SS)</option>
                                            <option value="SV">Savona (SV)</option>
                                            <option value="SI">Siena (SI)</option>
                                            <option value="SR">Siracusa (SR)</option>
                                            <option value="SO">Sondrio (SO)</option>
                                            <option value="TA">Taranto (TA)</option>
                                            <option value="TE">Teramo (TE)</option>
                                            <option value="TR">Terni (TR)</option>
                                            <option value="TO">Torino (TO)</option>
                                            <option value="TP">Trapani (TP)</option>
                                            <option value="TN">Trento (TN)</option>
                                            <option value="TV">Treviso (TV)</option>
                                            <option value="TS">Trieste (TS)</option>
                                            <option value="UD">Udine (UD)</option>
                                            <option value="VA">Varese (VA)</option>
                                            <option value="VE">Venezia (VE)</option>
                                            <option value="VB">Verbania (VB)</option>
                                            <option value="VC">Vercelli (VC)</option>
                                            <option value="VR">Verona (VR)</option>
                                            <option value="VV">Vibo Valentia (VV)</option>
                                            <option value="VI">Vicenza (VI)</option>
                                            <option value="VT">Viterbo (VT)</option>
                                        </select>
                                        <div className="invalid-feedback">
                                            Scegli una provincia.
                                        </div>
                                    </div>
                                </div>

                                <hr className="my-4" />



                                <h4 className="mb-3">Pagamento</h4>
                                <p>Tutte le transazioni sono sicure e crittografate.</p>

                                <div className="my-3">
                                    <div className="form-check">
                                        <input
                                            id="credit"
                                            name="paymentMethod"
                                            type="radio"
                                            className="form-check-input"
                                            defaultChecked
                                            required
                                        />
                                        <label className="form-check-label" htmlFor="credit">
                                            Carta di credito
                                        </label>
                                    </div>
                                </div>



                                <div className="row gy-3">
                                    <div className="col-md-12">
                                        <label htmlFor="card-number" className="form-label">Numero della carta</label>
                                        <div className="form-control py-2">
                                            <CardNumberElement
                                                id="card-number"
                                                options={{
                                                    style: {
                                                        base: {
                                                            fontSize: '16px',
                                                            color: '#495057',
                                                            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                                                            '::placeholder': {
                                                                color: '#6c757d',
                                                            },
                                                        },
                                                        invalid: {
                                                            color: '#dc3545',
                                                            iconColor: '#dc3545',
                                                        },
                                                    },
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="card-expiry" className="form-label">Data di scadenza</label>
                                        <div className="form-control py-2">
                                            <CardExpiryElement
                                                id="card-expiry"
                                                options={{
                                                    style: {
                                                        base: {
                                                            fontSize: '16px',
                                                            color: '#495057',
                                                            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                                                            '::placeholder': {
                                                                color: '#6c757d',
                                                            },
                                                        },
                                                        invalid: {
                                                            color: '#dc3545',
                                                            iconColor: '#dc3545',
                                                        },
                                                    },
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="card-cvc" className="form-label">CVV</label>
                                        <div className="form-control py-2">
                                            <CardCvcElement
                                                id="card-cvc"
                                                options={{
                                                    style: {
                                                        base: {
                                                            fontSize: '16px',
                                                            color: '#495057',
                                                            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                                                            '::placeholder': {
                                                                color: '#6c757d',
                                                            },
                                                        },
                                                        invalid: {
                                                            color: '#dc3545',
                                                            iconColor: '#dc3545',
                                                        },
                                                    },
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <hr className="my-4" />

                                {isLoading ? (
                                    <button className="btn btn-primary w-100" disabled>
                                        <span className="spinner-border spinner-border-sm me-2 btn-purchase" role="status" aria-hidden="true"></span>
                                        Elaborazione in corso...
                                    </button>
                                ) : (
                                    <button className="btn btn-primary w-100" type="submit">Acquista ora</button>
                                )}
                            </form>
                        </div>
                    </div>
                </main>

            </div>
        </>

    )
}