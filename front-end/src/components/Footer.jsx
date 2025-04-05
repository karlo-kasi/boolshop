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
                    <section className="d-flex justify-content-between align-items-center">
                        <div>
                            <img className="logo" src="../public/logo-footer.png" alt="boolshop-footer" width="350px"/>
                            <p className="text-white small-text">
                                Boolshop® | BL s.p.a P.IVA e CF 01888310032 <br />
                                Via Circonvallazione s/n 28010 Milano - Italia Tel. +39 0322980909 - Fax. +39 0322980910
                            </p>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                            <img src="icons/apple-pay.png" alt="apple pay" width="40px" height="40px"/>
                            <img src="icons/google.png" alt="google pay" width="45px" height="48px"/>
                            <img src="icons/money.png" alt="mastercard" width="45px" height="42px"/>
                            <img src="icons/visa.png" alt="visa" width="40px" height="42px"/>
                            <img src="icons/paypal.png" alt="paypal" width="40px" height="38px"/>
                            <img src="icons/american-express.png" alt="american express" width="40px" height="40px"/>
                        </div>
                    </section>
                </div>
            </footer>
        </>
    )
}