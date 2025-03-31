import connection from "../data/db-cover.js";



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
                image: req.imagePath + cover.image_url,
            }
        });
        res.json(covers);
    });
}

function show(req, res) {
    const { id } = req.params
    const sql = 'SELECT * FROM products WHERE id = ?';

    connection.query(sql, [id], (err, results) => {
        if (err)
            return res.status(500).json({
                error: 'Errore lato server SHOW function',
            });

            const cover = results[0]

            res.json({ 
                ...cover,
                image: req.imagePath + cover.image_url,
              });
    });
}

function search(req, res) {

    const searchTerm = req.query.name || ''
    console.log("searchTerm:", searchTerm)

    let sql = 'SELECT * FROM products'
    const params = [];

    if (searchTerm) {
        sql += ' WHERE name LIKE ?';
        params.push(`%${searchTerm}%`);
    }

    console.log("SQL:", sql, params);

    connection.query(sql, params, (err, results) => {
        if (err) {
            console.error("Errore nella query:", err);
            return res.status(500).json({
                error: 'Errore lato server SEARCH function',
            });
        }

        console.log("Results:", results);

        const covers = results.map(cover => ({
            ...cover,
            image: req.imagePath + cover.image_url,
        }));

        res.json(covers);
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
    search,
    storeOrder
}