import connection from "../data/db-cover.js";
import setImagePath from "../middlewares/imagePath.js";



function index(req, res) {
    const sql = 'SELECT * FROM products';

    connection.query(sql, (err, results) => {
        if (err)
            return res.status(500).json({
                error: 'Errore lato server INDEX function',
            });

            const covers = results.map(cover => {
                return {
                    ...cover,
                    image: req.imagePath + cover.image_url
                }
            });
        res.json(covers);
    });
}

function show(req, res) {
    const {id} = req.params
    const sql = 'SELECT * FROM products WHERE id = ?';

    connection.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Errore lato server SHOW function' });
        }

        if (results.length === 0) {  
            return res.status(404).json({ error: 'Prodotto non trovato' });
        }

        const cover = results[0]; 

        res.json({ 
            ...cover,
            image: cover.image_url ? req.imagePath + cover.image_url : null, 
        });
    });
}

function storeOrder(req, res) {

    

    const { coupon_id, total, shipping_address, billing_address, status } = req.body

    const sql = 'INSERT INTO orders ( coupon_id, total, shipping_address, billing_address, status ) VALUES (?,?,?,?,?)'

    connection.query(sql, [coupon_id, total, shipping_address, billing_address, status], (err, results) => {
        if (err)
            return res.status(500).json({
                error: 'Database Errore StoreOrders',
            })

        res.status(201);
        res.json({
            message: 'Order Added',
            id: results.insertId,
        });
    })
}

export {
    index,
    show,
    storeOrder
}