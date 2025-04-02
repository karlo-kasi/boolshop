import { useState, useEffect } from "react";
import axios from "axios";

export default function Checkout() {
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

    const handleSubmit = (e) => {
        e.preventDefault();

        const shippingAddress = `${formData.shipping_address}, ${formData.city}, ${formData.province}, ${formData.zip}`;


        const dataToSubmit = {
            ...formData,
            shipping_address: shippingAddress,
            billing_address: shippingAddress,
            coupon_id: 1,
            products: products
        };

        axios.post("http://localhost:3000/cover/order", dataToSubmit, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    useEffect(() => {
        axios
            .get("http://localhost:3000/cover")
            .then((response) => {
                const products = response.data.filter(d => d.id > 10 && d.id < 16);
                setCart(products);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    }, []);

    let totalPrice = 0;
    const products = cart.map((product) => {
        totalPrice += parseFloat(product.price);
        return {
            product_id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
        };
    })

    console.log(products)

    return (
        <>
            <div className="container my-5">
                <main>
                    <div className="row g-5">
                        <div className="col-md-5 col-lg-4 order-md-last">
                            <h4 className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-primary">Your cart</span>
                                <span className="badge bg-primary rounded-pill">{products.length}</span>
                            </h4>

                            <ul className="list-group mb-3">
                                {
                                    products.map(product => {
                                        return (
                                            <li key={product.product_id} className="list-group-item d-flex justify-content-between lh-sm">
                                                <div>
                                                    <h6 className="my-0">{product.name}</h6>
                                                </div>
                                                <span className="text-body-secondary">{product.price}&euro;</span>
                                            </li>
                                        )
                                    }
                                )}
                                <li className="list-group-item d-flex justify-content-between bg-body-tertiary">
                                    <div className="text-success">
                                        <h6 className="my-0">Promo code</h6>
                                        <small>EXAMPLECODE</small>
                                    </div>
                                    <span className="text-success">−$5</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <span>Totale</span>
                                    <strong>{totalPrice}</strong>
                                </li>
                            </ul>

                            <form className="card p-2">
                                <div className="input-group">
                                    <input type="text" className="form-control" placeholder="Promo code" />
                                    <button type="submit" className="btn btn-secondary">Redeem</button>
                                </div>
                            </form>
                        </div>

                        <div className="col-md-7 col-lg-8">
                            <h4 className="mb-3">Billing address</h4>
                            {/* Aggiungi noValidate per disabilitare la validazione HTML di default */}
                            <form className="needs-validation" onSubmit={handleSubmit} noValidate>
                                <div className="row g-3">
                                    <div className="col-sm-6">
                                        <label htmlFor="firstName" className="form-label">Nome</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="firstName"
                                            placeholder=""
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                        <div className="invalid-feedback">
                                            Valid first name is required.
                                        </div>
                                    </div>

                                    <div className="col-sm-6">
                                        <label htmlFor="lastName" className="form-label">Cognome</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            placeholder=""
                                            name="surname"
                                            value={formData.surname}
                                            onChange={handleChange}
                                            required
                                        />
                                        <div className="invalid-feedback">
                                            Valid last name is required.
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <label htmlFor="email" className="form-label">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            placeholder="you@example.com"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                        <div className="invalid-feedback">
                                            Please enter a valid email address for shipping updates.
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <label htmlFor="phone_number" className="form-label">
                                            Telefono
                                        </label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            id="phone_number"
                                            placeholder="333333333"
                                            name="phone_number"
                                            value={formData.phone_number}
                                            onChange={handleChange}
                                            required
                                        />
                                        <div className="invalid-feedback">
                                            Please enter a valid phone number for shipping updates.
                                        </div>
                                    </div>


                                    <div className="col-12">
                                        <label htmlFor="shipping_address" className="form-label">Indirizzo</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="shipping_address"
                                            placeholder="1234 Main St"
                                            name="shipping_address"
                                            value={formData.shipping_address}
                                            onChange={handleChange}
                                            required
                                        />
                                        <div className="invalid-feedback">
                                            Please enter your shipping address.
                                        </div>
                                    </div>



                                    <div className="col-md-3">
                                        <label htmlFor="city" className="form-label">Città</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="city"
                                            placeholder=""
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                        />
                                        <div className="invalid-feedback">
                                            Please enter a valid city.
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <label htmlFor="zip" className="form-label">CAP</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="zip"
                                            placeholder=""
                                            name="zip"
                                            value={formData.zip}
                                            onChange={handleChange}
                                            required
                                        />
                                        <div className="invalid-feedback">
                                            Zip code required.
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <label htmlFor="province" className="form-label">Provincia</label>
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
                                            Please provide a valid province.
                                        </div>
                                    </div>
                                </div>

                                <hr className="my-4" />

                                {/*<div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="same-address"
                                    />
                                    <label className="form-check-label" htmlFor="same-address">
                                        Shipping address is the same as my billing address
                                    </label>
                                </div>

                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="save-info"
                                    />
                                    <label className="form-check-label" htmlFor="save-info">
                                        Save this information for next time
                                    </label>
                                </div>

                                <hr className="my-4" />

                                <h4 className="mb-3">Payment</h4>

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
                                            Credit card
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            id="debit"
                                            name="paymentMethod"
                                            type="radio"
                                            className="form-check-input"
                                            required
                                        />
                                        <label className="form-check-label" htmlFor="debit">
                                            Debit card
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            id="paypal"
                                            name="paymentMethod"
                                            type="radio"
                                            className="form-check-input"
                                            required
                                        />
                                        <label className="form-check-label" htmlFor="paypal">
                                            PayPal
                                        </label>
                                    </div>
                                </div>

                                <div className="row gy-3">
                                    <div className="col-md-6">
                                        <label htmlFor="cc-name" className="form-label">Name on card</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="cc-name"
                                            placeholder=""
                                            required
                                        />
                                        <small className="text-body-secondary">
                                            Full name as displayed on card
                                        </small>
                                        <div className="invalid-feedback">
                                            Name on card is required
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="cc-number" className="form-label">Credit card number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="cc-number"
                                            placeholder=""
                                            required
                                        />
                                        <div className="invalid-feedback">
                                            Credit card number is required
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <label htmlFor="cc-expiration" className="form-label">Expiration</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="cc-expiration"
                                            placeholder=""
                                            required
                                        />
                                        <div className="invalid-feedback">
                                            Expiration date required
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <label htmlFor="cc-cvv" className="form-label">CVV</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="cc-cvv"
                                            placeholder=""
                                            required
                                        />
                                        <div className="invalid-feedback">
                                            Security code required
                                        </div>
                                    </div>
                                </div>

                                <hr className="my-4" />*/}

                                <button className="w-100 btn btn-primary btn-lg" type="submit">
                                    Continue to checkout
                                </button>
                            </form>
                        </div>
                    </div>
                </main>

            </div>
        </>

    )
}