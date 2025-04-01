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
                        <img src="icons/apple-pay.png" alt="apple pay" width="42px" />
                        <img src="icons/google.png" alt="google pay" width="45px" />
                        <img src="icons/money.png" alt="mastercard" width="40px" />
                        <img src="icons/visa.png" alt="visa" width="40px" />
                        <img src="icons/paypal.png" alt="paypal" width="45px" />
                        <img src="icons/american-express.png" alt="american express" width="38px" />
                    </div>
                </div>
            </footer>
        </>
    )
}