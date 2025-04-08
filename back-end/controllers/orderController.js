import nodemailer from 'nodemailer';
import connection from '../data/db-cover.js';

function sendConfirmationEmail(name, email, orderId, total, arrayProducts) {
    // Crea un trasportatore SMTP usando le credenziali di Mailtrap
    let transporter = nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io',  // Server SMTP di Mailtrap
        port: 2525,                 // Porta SMTP            // Usa TLS
        auth: {
            user: 'cf79ddc6a81dc7',    // Il tuo username di Mailtrap
            pass: 'c1da937a604768'     // La tua password di Mailtrap
        },
    });

    let productListHtml = '';
    arrayProducts.forEach(product => {
        productListHtml += `
        <li>
            <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; margin-right: 10px; vertical-align: middle;" />
            <strong>${product.name}</strong> x ${product.quantity}
        </li>
        `;
    });

    let htmlContent = `
    <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f9f9f9;
                    color: #333;
                    padding: 20px;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 20px;
                    color: #4CAF50;
                }
                .order-details {
                    margin-bottom: 30px;
                }
                .order-details p {
                    font-size: 16px;
                    margin: 8px 0;
                }
                .order-summary {
                    background-color: #f4f4f4;
                    padding: 15px;
                    border-radius: 5px;
                }
                .total {
                    font-size: 18px;
                    font-weight: bold;
                    color: #4CAF50;
                }
                .footer {
                    text-align: center;
                    font-size: 14px;
                    color: #777;
                    margin-top: 30px;
                }
                ul {
                    list-style-type: none;
                    padding: 0;
                    margin: 0;
                }
                li {
                    text-align: justify;
                    margin-bottom: 10px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    Grazie per il tuo ordine, ${name}!
                </div>
                <div class="order-details">
                    <p>Abbiamo ricevuto il tuo ordine con il numero: <strong>#${orderId}</strong></p>
                    <p>Il tuo ordine è stato registrato con successo e sarà elaborato al più presto.</p>
                </div>
                <div class="order-summary">
                    <p><strong>Dettagli Ordine:</strong></p>
                    <ul>${productListHtml}<ul/>
                    <h3>Totale dell'ordine: <span class="total">${total.toFixed(2)}€</span></h3>
                </div>
                <div class="footer">
                    <p>Se hai domande o hai bisogno di assistenza, non esitare a contattarci.</p>
                    <p>BoolShop - Il tuo negozio online di fiducia.</p>
                    <img src="http://localhost:3000/boolshop-logo.svg" alt="Logo BoolShop" style="width: 100px; height: auto; margin-top: 10px; text-align: center" />
                </div>
            </div>
        </body>
    </html>`;

    // Configura i dettagli dell'email
    let mailOptions = {
        from: '"BoolShop" <info@boolshop.com>', // Il mittente dell'email
        to: email, // Il destinatario
        subject: `Conferma Ordine id: #${orderId}`,
        //text: `Ciao ${name}, questo è il tuo ordine ${orderId} e il prezzo totale è: ${total}`,       // Corpo del messaggio in testo semplice
        html: htmlContent // Corpo del messaggio in HTML
    };

    // Invia l'email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Errore nell\'invio dell\'email: ', error);
        }
        console.log('Email inviata: ' + info.response);
    });
}


function storeOrder(req, res) {
    const { name, surname, email, coupon_id, city, province, zip, phone_number, billing_address } = req.body;
    let { products, shipping_address } = req.body;

    // Validazione dei dati dell'ordine
    //if (!name || !email || !surname || !shipping_address || !phone_number || !products) {
    //    return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
    //}

    if (!name || name.trim().length < 3) {
        return res.status(400).json({ error: 'Il nome deve contenere almeno 3 caratteri' });
    }
    if (!surname || surname.trim().length < 3) {
        return res.status(400).json({ error: 'Il cognome deve contenere almeno 3 caratteri' });
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ error: 'Email non valida' });
    }
    if (!shipping_address || shipping_address.trim().length < 5) {
        return res.status(400).json({ error: 'L\'indirizzo di spedizione deve contenere almeno 5 caratteri' });
    }
    if (!city || city.trim().length < 3) {
        return res.status(400).json({ error: 'La città deve contenere almeno 3 caratteri' });
    }
    if (!province || province.trim().length !== 2) {
        return res.status(400).json({ error: 'Scegli una provincia' });
    }
    if (!zip || zip.trim().length !== 5) {
        return res.status(400).json({ error: 'Il CAP deve essere composto da 5 caratteri' });
    }    
    if (!phone_number && /^\d{10}$/.test(phone_number) === false) {
        return res.status(400).json({ error: 'Il numero di telefono deve contenere 10 cifre' });
    }

    shipping_address = `${shipping_address}, ${city}(${province}), ${zip}`;

    // Logica per ottenere i prodotti dal carrello
    let productsIds = products.map(element => {
        return element.product_id;
    });

    const sqlProducts = 'SELECT * FROM products WHERE id IN (?)';

    connection.query(sqlProducts, [productsIds], (err, results) => {
        if (err) {
            console.error("Errore nella query:", err);
            return res.status(500).json({ error: 'Errore lato server' });
        }

        // Verifica se i prodotti esistono
        if (results.length !== products.length) {
            return res.status(404).json({ error: 'Alcuni prodotti non sono stati trovati' });
        }

        // Memorizza l'ordine
        const arrayProducts = results.map((product) => {
            const productInCart = products.find(p => p.product_id === product.id);
            return {
                ...product,
                quantity: productInCart.quantity,
                image: productInCart.image,
                price: product.price,
                name: product.name,
                product_id: product.id,
            };
        })


        // Logica per memorizzare l'ordine nel database
        const sqlOrder = 'INSERT INTO orders (name, email, surname, shipping_address, billing_address, phone_number, coupon_id, total) VALUES (?,?,?,?,?,?,?,?)';

        let total = 0;
        arrayProducts.forEach(element => {
            total += element.price * element.quantity;
        });

        if (total < 29.99) {
            total += 13;
        }

        connection.query(sqlOrder, [name, email, surname, shipping_address, billing_address, phone_number, coupon_id, total], (err, results) => {
            if (err) {
                console.error("Errore nella query:", err);
                return res.status(500).json({ error: 'Errore lato server' });
            }

            const orderId = results.insertId;

            // Ora inseriamo i prodotti nell'ordine
            const sqlOrderItems = 'INSERT INTO order_items (order_id, product_id, quantity, price, name) VALUES ?';
            const orderItems = arrayProducts.map(product => [orderId, product.product_id, product.quantity, product.price, product.name]);

            connection.query(sqlOrderItems, [orderItems], (err, results) => {
                if (err) {
                    console.error("Errore nell'inserimento dei prodotti:", err);
                    return res.status(500).json({ error: 'Errore nell\'aggiunta dei prodotti all\'ordine' });
                }

                // Se l'ordine e i prodotti sono stati memorizzati con successo, invia l'email di conferma
                sendConfirmationEmail(name, email, orderId, total, arrayProducts);

                res.status(201).json({ message: 'Ordine creato con successo' });
            });
        });
    });
}

export default storeOrder;