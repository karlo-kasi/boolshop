import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
        sameBillingAddress: true,
        billing_address: "", 
        acceptTerms: false,
    };

    const [cart, setCart] = useState([]);
    const [formData, setFormData] = useState(initalData);
    const [isFormValid, setIsFormValid] = useState(true);
    const [isChecked, setIsChecked] = useState(false);
    const [serverErrors, setServerErrors] = useState({
        name: '',
        surname: '',
        email: '',
        phone_number: '',
        shipping_address: '',
        city: '',
        zip: '',
        province: '',
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
            newErrors.phone_number = "Il numero di telefono deve essere lungo 10 cifre.";
        }

        if (formData.shipping_address.trim().length < 5) {
            newErrors.shipping_address = "L'indirizzo deve essere lungo almeno 5 caratteri.";
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = { ...errors };
        let isValid = validateForm();
        if (!isValid) {
            setIsFormValid(false);
            return;
        }

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
            billing_address: formData.sameBillingAddress
                ? formData.shipping_address
                : formData.billing_address,
            products: productsToSend
        };

        axios.post("http://localhost:3000/cover/order", dataToSubmit, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                console.log("Response:", response.data);
                // Gestisci la risposta del server qui, ad esempio, reindirizza l'utente a una pagina di conferma
                localStorage.removeItem("cartItems");
                setCart([]);
                setFormData(initalData);
                navigate("/thank-you");
            })
            .catch((error) => {

                console.error("Error:", error);
                if (error.response && error.response.status === 400) {
                    console.log("Errori dal server:", error.response.data);
                    // Reset degli errori precedenti
                    setServerErrors(prevErrors => ({
                        ...prevErrors,
                        ...error.response.data,
                    }));
                    // Gestisci l'errore qui, ad esempio, mostra un messaggio di errore all'utente
                }
                setIsFormValid(false);
            });

    }

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });

        setErrors(() => {
            const newErrors = { ...errors };

            if (name === "name") {
                const name = value.trim()

                if (name.length < 3) {
                    newErrors.name = "Il nome deve essere lungo almeno 3 caratteri.";
                } else {
                    newErrors.name = ""; // Rimuove l'errore se la condizione è soddisfatta
                }
            }

            if (name === "surname") {
                const surname = value.trim()

                if (surname.length < 3) {
                    newErrors.surname = "Il cognome deve essere lungo almeno 3 caratteri.";
                } else {
                    newErrors.surname = ""; // Rimuove l'errore se la condizione è soddisfatta
                }
            }

            if (name === "email") {
                const email = value.trim()

                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(email)) {
                    newErrors.email = "Inserisci un'email valida.";
                } else {
                    newErrors.email = ""; // Rimuove l'errore se la condizione è soddisfatta
                }
            }

            if (name === "phone_number") {
                const phone = value.trim()

                const phonePattern = /^\d{10}$/; // Modifica il pattern in base al formato desiderato
                if (!phonePattern.test(phone)) {
                    newErrors.phone_number = "Il numero di telefono deve essere lungo 10 cifre.";
                } else {
                    newErrors.phone_number = ""; // Rimuove l'errore se la condizione è soddisfatta
                }
            }

            if (name === "shipping_address") {
                const address = value.trim()

                if (address.length < 5) {
                    newErrors.shipping_address = "L'indirizzo deve essere lungo almeno 5 caratteri.";
                } else {
                    newErrors.shipping_address = ""; // Rimuove l'errore se la condizione è soddisfatta
                }
            }

            if (name === "city") {
                const city = value.trim()

                if (city.length < 3) {
                    newErrors.city = "La città deve essere lunga almeno 3 caratteri.";
                } else {
                    newErrors.city = ""; // Rimuove l'errore se la condizione è soddisfatta
                }
            }

            if (name === "zip") {
                const zip = value.trim()

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
                    newErrors.billing_address = "L'indirizzo di fatturazione deve essere lungo almeno 5 caratteri.";
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

    useEffect(() => {
        const storedCart = localStorage.getItem("cartItems");
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, []);

    let totalPrice = 0;
    let totalQuantity = 0;
    const productsToSend = cart.map((product) => {
        totalPrice += parseFloat(product.price) * product.quantity;
        totalQuantity += product.quantity;
        return {
            product_id: product.id,
            quantity: product.quantity,
            image: product.image
        };
    })
    totalPrice = totalPrice.toFixed(2);

    return (
        <>
            <div className="container my-5">
                <main>
                    <div className="row g-5">
                        <div className="col-md-5 col-lg-4 order-md-last">
                            <h4 className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-primary">Il tuo carrello</span>
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
                                <div className="alert alert-secondary" role="alert">
                                    <strong>Attenzione!</strong> Tutti i campi sono obbligatori.
                                </div>
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
                                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                        {!errors.name && serverErrors.name && <div className="invalid-feedback">{serverErrors.name}</div>}

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
                                        {errors.surname && <div className="invalid-feedback">{errors.surname}</div>}
                                        {!errors.surname && serverErrors.surname && <div className="invalid-feedback">{serverErrors.surname}</div>}
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
                                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                        {!errors.email && serverErrors.email && <div className="invalid-feedback">{serverErrors.email}</div>}
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
                                        {errors.phone_number && <div className="invalid-feedback">{errors.phone_number}</div>}
                                        {!errors.phone_number && serverErrors.phone_number && <div className="invalid-feedback">{serverErrors.phone_number}</div>}
                                    </div>


                                    <div className="col-12">
                                        <label htmlFor="shipping_address" className="form-label">Indirizzo</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.shipping_address ? 'is-invalid' : ''}`}
                                            id="shipping_address"
                                            placeholder="Via Roma 1"
                                            name="shipping_address"
                                            value={formData.shipping_address}
                                            onChange={handleChange}
                                            required
                                        />
                                        {errors.shipping_address && <div className="invalid-feedback">{errors.shipping_address}</div>}
                                        {!errors.shipping_address && serverErrors.shipping_address && <div className="invalid-feedback">{serverErrors.shipping_address}</div>}

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
                                        {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                                        {!errors.city && serverErrors.city && <div className="invalid-feedback">{serverErrors.city}</div>}
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
                                        {errors.zip && <div className="invalid-feedback">{errors.zip}</div>}
                                        {!errors.zip && serverErrors.zip && <div className="invalid-feedback">{serverErrors.zip}</div>}
                                    </div>

                                    <div className="col-md-4">
                                        <label htmlFor="province" className={`form-label ${errors.province ? 'is-invalid' : ''}`}>Provincia</label>
                                        <select
                                            className={`form-select ${errors.province ? 'is-invalid' : ''}`}
                                            id="province"
                                            name="province"
                                            value={formData.province}
                                            onChange={handleChange}
                                            required>
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
                                        {errors.province && <div className="invalid-feedback">{errors.province}</div>}
                                        {!errors.province && serverErrors.province && <div className="invalid-feedback">{serverErrors.province}</div>}
                                    </div>
                                </div>

                                <hr className="my-4" />

                                <div className="mb-3 form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="sameBillingAddress"
                                        name="sameBillingAddress"
                                        checked={formData.sameBillingAddress}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="sameBillingAddress">
                                        Usa lo stesso indirizzo per la fatturazione
                                    </label>
                                </div>

                                {!formData.sameBillingAddress && (
                                    <div className="mb-3">
                                        <label htmlFor="billing_address" className="form-label">Indirizzo di fatturazione</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.billing_address ? "is-invalid" : ""}`}
                                            id="billing_address"
                                            name="billing_address"
                                            value={formData.billing_address}
                                            onChange={handleChange}
                                        />
                                        {errors.billing_address && <div className="invalid-feedback">{errors.billing_address}</div>}
                                    </div>
                                )}

                                <div className="form-check my-3">
                                    <input
                                        className={`form-check-input ${errors.acceptTerms ? "is-invalid" : ""}`}
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
                                        <div className="invalid-feedback d-block">{errors.acceptTerms}</div>
                                    )}
                                </div>

                                <button className="w-100 btn btn-primary btn-lg" type="submit">
                                    Conferma l'ordine
                                </button>
                            </form>
                        </div>
                    </div>
                </main>

            </div>
        </>

    )
}