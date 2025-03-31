export default function Footer() {
  return (
    <>
        <section className="d-flex justify-content-between bg-dark text-white p-3">
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
    </>
   )
}