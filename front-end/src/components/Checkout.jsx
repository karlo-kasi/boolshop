import { useState, useEffect } from "react";
import axios from "axios";
import { data, useNavigate } from "react-router-dom";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

export default function Checkout({ onPaymentSuccess }) {
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
    sameBillingAddress: true,
    billing_address: "",
    acceptTerms: false,
  };

  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState(initalData);
  const [isFormValid, setIsFormValid] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [serverErrors, setServerErrors] = useState({
    name: "",
    surname: "",
    email: "",
    phone_number: "",
    shipping_address: "",
    city: "",
    zip: "",
    province: "",
  });
  let [errors, setErrors] = useState({
    name: "",
    surname: "",
    email: "",
    shipping_address: "",
    city: "",
    province: "",
    zip: "",
    phone_number: "",
    acceptTerms: "",
  });

  console.log(cart);

  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  //const submitOrder = async (dataToSubmit) => {
  //    try {
  //        const response = await axios.post("http://localhost:3000/cover/order", dataToSubmit, {
  //            headers: { 'Content-Type': 'application/json' },
  //        });
  //        console.log("Order Response:", response.data);
  //        // Azioni in caso di successo: svuotare il carrello, resettare il form, reindirizzare l'utente, ecc.
  //        localStorage.removeItem("cartItems");
  //        setCart([]);
  //        setFormData(initalData);
  //        navigate("/thank-you");
  //    } catch (error) {
  //        console.error("Errore nell'invio dell'ordine:", error);
  //        setIsFormValid(false);
  //    }
  //};

  const validateForm = () => {
    const newErrors = {};

    if (formData.name.trim().length < 3) {
      newErrors.name = "Il nome deve essere lungo almeno 3 caratteri.";
    }

    if (formData.surname.trim().length < 3) {
      newErrors.surname = "Il cognome deve essere lungo almeno 3 caratteri.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email.trim())) {
      newErrors.email = "Inserisci un'email valida.";
    }

    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(formData.phone_number.trim())) {
      newErrors.phone_number =
        "Il numero di telefono deve essere lungo 10 cifre.";
    }

    if (formData.shipping_address.trim().length < 5) {
      newErrors.shipping_address =
        "L'indirizzo deve essere lungo almeno 5 caratteri.";
    }

    if (formData.city.trim().length < 3) {
      newErrors.city = "La città deve essere lunga almeno 3 caratteri.";
    }

    const zipPattern = /^\d{5}$/;
    if (!zipPattern.test(formData.zip.trim())) {
      newErrors.zip = "Il CAP deve essere lungo 5 cifre.";
    }

    if (formData.province === "") {
      newErrors.province = "Seleziona una provincia.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = { ...errors };
    let isValid = validateForm();
    if (!isValid) {
      setIsFormValid(false);
      return;
    }

    // Costruisci l'indirizzo di spedizione combinando i vari campi
    const shippingAddress = `${formData.shipping_address}, ${formData.city}, ${formData.province}, ${formData.zip}`;

    // Prepara i dati dell'ordine da inviare al backend
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Devi accettare i termini e condizioni.";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      setIsFormValid(false);
      return;
    }

    const dataToSubmit = {
      ...formData,
      coupon_id: 1,
      shippingAddress: formData.shipping_address,
      billing_address: formData.sameBillingAddress
        ? formData.shipping_address
        : formData.billing_address,
      products: productsToSend,
    };

    // Primo step: gestisci il pagamento
    setIsLoading(true);
    const paymentSuccessful = await handlePayment();
    setIsLoading(false);

    if (paymentSuccessful && cart.length > 0) {
      // Se il pagamento va a buon fine, invia l'ordine
      axios
        .post("http://localhost:3000/cover/order", dataToSubmit, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("Response:", response.data);
          // Gestisci la risposta del server qui, ad esempio, reindirizza l'utente a una pagina di conferma
          localStorage.removeItem("cartItems");
          setCart([]);
          setFormData(initalData);
          navigate("/thank-you");
          onPaymentSuccess(); // Svuota il carrello dopo il pagamento
        })
        .catch((error) => {
          console.error("Error:", error);
          if (error.response && error.response.status === 400) {
            console.log("Errori dal server:", error.response.data);
            // Reset degli errori precedenti
            setServerErrors((prevErrors) => ({
              ...prevErrors,
              ...error.response.data,
            }));
            // Gestisci l'errore qui, ad esempio, mostra un messaggio di errore all'utente
          }
          setIsFormValid(false);
        });
    } else {
      // Se il pagamento fallisce, gestisci l'errore
      setPaymentError("Il pagamento non è andato a buon fine.");
      setPaymentSuccess(false);
      // Gestisci il caso in cui il pagamento fallisca (ad es. mostra un messaggio di errore)
      console.error(
        "Il pagamento non è andato a buon fine. L'ordine non verrà inviato."
      );
    }
  };

  //validazione dei campi
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    setErrors(() => {
      const newErrors = { ...errors };

      if (name === "name") {
        const name = value.trim();

        if (name.length < 3) {
          newErrors.name = "Il nome deve essere lungo almeno 3 caratteri.";
        } else {
          newErrors.name = ""; // Rimuove l'errore se la condizione è soddisfatta
        }
      }

      if (name === "surname") {
        const surname = value.trim();

        if (surname.length < 3) {
          newErrors.surname =
            "Il cognome deve essere lungo almeno 3 caratteri.";
        } else {
          newErrors.surname = ""; // Rimuove l'errore se la condizione è soddisfatta
        }
      }

      if (name === "email") {
        const email = value.trim();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
          newErrors.email = "Inserisci un'email valida.";
        } else {
          newErrors.email = ""; // Rimuove l'errore se la condizione è soddisfatta
        }
      }

      if (name === "phone_number") {
        const phone = value.trim();

        const phonePattern = /^\d{10}$/; // Modifica il pattern in base al formato desiderato
        if (!phonePattern.test(phone)) {
          newErrors.phone_number =
            "Il numero di telefono deve essere lungo 10 cifre.";
        } else {
          newErrors.phone_number = ""; // Rimuove l'errore se la condizione è soddisfatta
        }
      }

      if (name === "shipping_address") {
        const address = value.trim();

        if (address.length < 5) {
          newErrors.shipping_address =
            "L'indirizzo deve essere lungo almeno 5 caratteri.";
        } else {
          newErrors.shipping_address = ""; // Rimuove l'errore se la condizione è soddisfatta
        }
      }

      if (name === "city") {
        const city = value.trim();

        if (city.length < 3) {
          newErrors.city = "La città deve essere lunga almeno 3 caratteri.";
        } else {
          newErrors.city = ""; // Rimuove l'errore se la condizione è soddisfatta
        }
      }

      if (name === "zip") {
        const zip = value.trim();

        const zipPattern = /^\d{5}$/; // Modifica il pattern in base al formato desiderato
        if (!zipPattern.test(zip)) {
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

      if (name === "billing_address" && !formData.sameBillingAddress) {
        if (value.trim().length < 5) {
          newErrors.billing_address =
            "L'indirizzo di fatturazione deve essere lungo almeno 5 caratteri.";
        } else {
          newErrors.billing_address = "";
        }
      }

      if (name === "acceptTerms" && !value) {
        newErrors.acceptTerms = "Devi accettare i termini e condizioni.";
      } else {
        newErrors.acceptTerms = "";
      }

      return newErrors;
    });
  };

  //Logica per il pagamaneto
  // Funzione per gestire il pagamento
  const handlePayment = async () => {
    if (cart.length === 0) return false;
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

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardNumber,
            billing_details: {
              name: `${formData.name} ${formData.surname}`,
              email: formData.email,
              phone: formData.phone_number,
            },
          },
        }
      );

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
      image: product.image,
    };
  });

  let paymentTotal = 0;
  if (totalPrice < 29.99) {
    paymentTotal = totalPrice + 13.0;
  } else {
    paymentTotal = totalPrice;
  }
  // Stripe richiede l'importo in centesimi come intero
  const amountInCents = Math.round(paymentTotal * 100);

  return (
    <>
      <div className="container my-5">
        <main>
          <div className="row g-5">
            <div className="col-md-5 col-lg-4 order-md-last">
              <h4 className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-primary">Il tuo carrello</span>
                <span className="badge bg-primary rounded-pill">
                  {totalQuantity}
                </span>
              </h4>

              {cart.length === 0 && (
                <div className="alert alert-danger" role="alert">
                  <strong>Il carrello è vuoto!</strong>
                </div>
              )}

              <ul className="list-group mb-3">
                {cart.map((product) => {
                  return (
                    <li
                      key={product.id}
                      className="list-group-item d-flex justify-content-between lh-sm"
                    >
                      <div>
                        <h6 className="my-0">{product.name}</h6>
                      </div>
                      <span className="text-body-secondary">
                        {product.quantity} x {product.price}&euro;
                      </span>
                      <img src={product.image} width="20px" alt="" />
                    </li>
                  );
                })}
                {totalPrice < 29.99 ? (
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
                )}
                <li className="list-group-item d-flex justify-content-between">
                  <span>Totale</span>
                  {totalPrice < 29.99 ? (
                    <span className="text-body-secondary">
                      {(parseFloat(totalPrice) + 13.0).toFixed(2)}&euro;
                    </span>
                  ) : (
                    <span className="text-success">{totalPrice}&euro;</span>
                  )}
                </li>
              </ul>
            </div>

            <div className="col-md-7 col-lg-8">
              <h4 className="mb-1">Inserisci i tuoi dati</h4>
              <form
                className="needs-validation"
                onSubmit={handleSubmit}
                noValidate
              >
                <div className="alert alert-secondary" role="alert">
                  <strong>Attenzione!</strong> Tutti i campi sono obbligatori.
                </div>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label htmlFor="firstName" className="form-label">
                      Nome
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.name ? "is-invalid" : ""
                      }`}
                      id="firstName"
                      placeholder=""
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                    {!errors.name && serverErrors.name && (
                      <div className="invalid-feedback">
                        {serverErrors.name}
                      </div>
                    )}
                  </div>

                  <div className="col-sm-6">
                    <label htmlFor="lastName" className="form-label">
                      Cognome
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.surname ? "is-invalid" : ""
                      }`}
                      id="lastName"
                      placeholder=""
                      name="surname"
                      value={formData.surname}
                      onChange={handleChange}
                      required
                    />
                    {errors.surname && (
                      <div className="invalid-feedback">{errors.surname}</div>
                    )}
                    {!errors.surname && serverErrors.surname && (
                      <div className="invalid-feedback">
                        {serverErrors.surname}
                      </div>
                    )}
                  </div>

                  <div className="col-12">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      id="email"
                      placeholder="you@example.com"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                    {!errors.email && serverErrors.email && (
                      <div className="invalid-feedback">
                        {serverErrors.email}
                      </div>
                    )}
                  </div>

                  <div className="col-12">
                    <label htmlFor="phone_number" className="form-label">
                      Telefono
                    </label>
                    <input
                      type="tel"
                      className={`form-control ${
                        errors.phone_number ? "is-invalid" : ""
                      }`}
                      id="phone_number"
                      placeholder="3333333333"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      required
                    />
                    {errors.phone_number && (
                      <div className="invalid-feedback">
                        {errors.phone_number}
                      </div>
                    )}
                    {!errors.phone_number && serverErrors.phone_number && (
                      <div className="invalid-feedback">
                        {serverErrors.phone_number}
                      </div>
                    )}
                  </div>

                  <div className="col-12">
                    <label htmlFor="shipping_address" className="form-label">
                      Indirizzo
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.shipping_address ? "is-invalid" : ""
                      }`}
                      id="shipping_address"
                      placeholder="Via Roma 1"
                      name="shipping_address"
                      value={formData.shipping_address}
                      onChange={handleChange}
                      required
                    />
                    {errors.shipping_address && (
                      <div className="invalid-feedback">
                        {errors.shipping_address}
                      </div>
                    )}
                    {!errors.shipping_address &&
                      serverErrors.shipping_address && (
                        <div className="invalid-feedback">
                          {serverErrors.shipping_address}
                        </div>
                      )}
                  </div>

                  <div className="col-md-3">
                    <label htmlFor="city" className="form-label">
                      Città
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.city ? "is-invalid" : ""
                      }`}
                      id="city"
                      placeholder=""
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                    {errors.city && (
                      <div className="invalid-feedback">{errors.city}</div>
                    )}
                    {!errors.city && serverErrors.city && (
                      <div className="invalid-feedback">
                        {serverErrors.city}
                      </div>
                    )}
                  </div>

                  <div className="col-md-3">
                    <label htmlFor="zip" className="form-label">
                      CAP
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.zip ? "is-invalid" : ""
                      }`}
                      id="zip"
                      placeholder=""
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      required
                    />
                    {errors.zip && (
                      <div className="invalid-feedback">{errors.zip}</div>
                    )}
                    {!errors.zip && serverErrors.zip && (
                      <div className="invalid-feedback">{serverErrors.zip}</div>
                    )}
                  </div>

                  <div className="col-md-4">
                    <label
                      htmlFor="province"
                      className={`form-label ${
                        errors.province ? "is-invalid" : ""
                      }`}
                    >
                      Provincia
                    </label>
                    <select
                      className={`form-select ${
                        errors.province ? "is-invalid" : ""
                      }`}
                      id="province"
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                      required
                    >
                      <option value={""}>Scegli</option>
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
                    {errors.province && (
                      <div className="invalid-feedback">{errors.province}</div>
                    )}
                    {!errors.province && serverErrors.province && (
                      <div className="invalid-feedback">
                        {serverErrors.province}
                      </div>
                    )}
                  </div>
                </div>

                <div className="my-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="sameBillingAddress"
                    name="sameBillingAddress"
                    checked={formData.sameBillingAddress}
                    onChange={handleChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="sameBillingAddress"
                  >
                    Usa lo stesso indirizzo per la fatturazione
                  </label>
                </div>

                {!formData.sameBillingAddress && (
                  <div className="mb-3">
                    <label htmlFor="billing_address" className="form-label">
                      Indirizzo di fatturazione
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.billing_address ? "is-invalid" : ""
                      }`}
                      id="billing_address"
                      name="billing_address"
                      value={formData.billing_address}
                      onChange={handleChange}
                    />
                    {errors.billing_address && (
                      <div className="invalid-feedback">
                        {errors.billing_address}
                      </div>
                    )}
                  </div>
                )}

                <hr className="my-4" />

                <h4 className="mb-3">Pagamento</h4>
                <p>Tutte le transazioni sono sicure e crittografate.</p>

                {paymentError && (
                  <div className="alert alert-danger" role="alert">
                    <strong>Errore:</strong> {paymentError}
                  </div>
                )}

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
                    <label htmlFor="card-number" className="form-label">
                      Numero della carta
                    </label>
                    <div className="form-control py-2">
                      <CardNumberElement
                        id="card-number"
                        options={{
                          style: {
                            base: {
                              fontSize: "16px",
                              color: "#495057",
                              fontFamily:
                                '"Helvetica Neue", Helvetica, Arial, sans-serif',
                              "::placeholder": {
                                color: "#6c757d",
                              },
                            },
                            invalid: {
                              color: "#dc3545",
                              iconColor: "#dc3545",
                            },
                          },
                        }}
                      />
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-md-5">
                      <label htmlFor="card-expiry" className="form-label">
                        Data di scadenza
                      </label>
                      <div className="form-control py-2">
                        <CardExpiryElement
                          id="card-expiry"
                          options={{
                            style: {
                              base: {
                                fontSize: "16px",
                                color: "#495057",
                                fontFamily:
                                  '"Helvetica Neue", Helvetica, Arial, sans-serif',
                                "::placeholder": {
                                  color: "#6c757d",
                                },
                              },
                              invalid: {
                                color: "#dc3545",
                                iconColor: "#dc3545",
                              },
                            },
                          }}
                        />
                      </div>
                    </div>

                    <div className="col-md-5">
                      <label htmlFor="card-cvc" className="form-label">
                        CVV
                      </label>
                      <div className="form-control py-2">
                        <CardCvcElement
                          id="card-cvc"
                          options={{
                            style: {
                              base: {
                                fontSize: "16px",
                                color: "#495057",
                                fontFamily:
                                  '"Helvetica Neue", Helvetica, Arial, sans-serif',
                                "::placeholder": {
                                  color: "#6c757d",
                                },
                              },
                              invalid: {
                                color: "#dc3545",
                                iconColor: "#dc3545",
                              },
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="my-3" />

                <div className="form-check mb-3">
                  <input
                    className={`form-check-input ${
                      errors.acceptTerms ? "is-invalid" : ""
                    }`}
                    type="checkbox"
                    id="acceptTerms"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="acceptTerms">
                    Accetto i termini e condizioni
                  </label>
                  {errors.acceptTerms && (
                    <div className="invalid-feedback d-block">
                      {errors.acceptTerms}
                    </div>
                  )}
                </div>

                {isLoading ? (
                  <button className="btn btn-primary w-100" disabled>
                    <span
                      className="spinner-border spinner-border-sm me-2 btn-purchase"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Elaborazione in corso...
                  </button>
                ) : (
                  <button className="btn btn-primary w-100" type="submit">
                    Acquista ora
                  </button>
                )}
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
