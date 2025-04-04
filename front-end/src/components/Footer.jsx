
//PAGAMENTI
import americanExpress from "../assets/img/american-express.png";

import applePay from "../assets/img/apple-pay.png";
import google from "../assets/img/google.png";
import money from "../assets/img/money.png";
import paypal from "../assets/img/paypal.png";
import visa from "../assets/img/visa.png";



export default function Footer() {
    return (
        <>
            <footer className="bg-dark">
                <div className="container">
                    <section className="d-flex justify-content-between text-white p-3">
                        <div>
                            <ul className="list-unstyled">
                                <li><strong>AZIENDA</strong></li>
                                <li><a className="text-white" href="#">La nostra storia</a></li>
                            </ul>
                        </div>
                        <div>
                            <ul className="list-unstyled">
                                <li><strong>ASSISTENZA E SUPPORTO</strong></li>
                                <li><a className="text-white" href="#">Il mio account</a></li>
                                <li><a className="text-white" href="#">Resi e rimborsi</a></li>
                                <li><a className="text-white" href="#">Informativa sui pagamenti</a></li>
                                <li><a className="text-white" href="#">Contatti</a></li>
                            </ul>
                        </div>
                        <div>
                            <ul className="list-unstyled">
                                <li><strong>INFORMAZIONI LEGALI E COOKIE</strong></li>
                                <li><a className="text-white" href="#">Cookie policy</a></li>
                                <li><a className="text-white" href="#">Privacy policy</a></li>
                            </ul>
                        </div>
                    </section>
                    <div className="d-flex justify-content-end p-2 gap-3">
                        <img src={americanExpress} alt="apple pay" width={25} height={25}/>
                        <img src={applePay} alt="mastercard" width={25} height={25} />
                        <img src={google} alt="visa" width={25} height={25} />
                        <img src={money} alt="paypal" width={25} height={25} />
                        <img src={paypal} alt="american express" width={25} height={25} />
                        <img src={visa} alt="google pay" width={25} height={25} />
                    </div>
                </div>
            </footer>
        </>
    )
}