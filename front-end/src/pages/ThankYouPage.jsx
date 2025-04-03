import { Link } from "react-router-dom"

export default function ThankYouPage() {
    return (
        <div className="container mb-5 mx-0 thank-you-page">
            <h1 className="text-center mt-5">Grazie per il tuo ordine!</h1>
            <div className="row">
                <div className="col-md-8 m-auto mt-5">
                    <div className="bg-light p-3 mb-4">
                        <div className="text-center">
                            <h5 className="mb-3">Il tuo ordine è stato ricevuto con successo.</h5>
                            <p className="mb-3">Riceverai un'email di conferma a breve.</p>
                            <Link to={"/"} className="btn btn-outline-dark">Torna alla home</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}