import connection from "../data/db-cover.js";

function search(req, res) {
    const searchTerm = req.query.name || '';
    const sort = req.query.sort || ''; // es: "price_asc", "recent", ecc.

    let sql = 'SELECT * FROM products';
    const params = [];

    // 1) Filtro di ricerca per nome/descrizione
    if (searchTerm) {
        sql += ' WHERE name LIKE ? OR description LIKE ?';
        params.push(`%${searchTerm}%`, `%${searchTerm}%`);
    }

    // 2) Ordinamento in base al parametro "sort"
    let orderClause = '';
    switch (sort) {
      case 'price_asc':
        orderClause = 'ORDER BY price ASC';
        break;
      case 'price_desc':
        orderClause = 'ORDER BY price DESC';
        break;
      case 'name_asc':
        orderClause = 'ORDER BY name ASC';
        break;
      case 'name_desc':
        orderClause = 'ORDER BY name DESC';
        break;
      case 'recent':
        // supponendo tu abbia una colonna "created_at" o simile
        orderClause = 'ORDER BY created_at DESC';
        break;
      default:
        // se non specificato, nessun ordine particolare
        // o decidi un default, es: ORDER BY id DESC
        // orderClause = 'ORDER BY id DESC';
        break;
    }

    if (orderClause) {
      sql += ` ${orderClause}`;
    }

    console.log('SQL:', sql, params);

    connection.query(sql, params, (err, results) => {
        if (err) {
            console.error("Errore nella query:", err);
            return res.status(500).json({
                error: 'Errore lato server SEARCH function',
            });
        }

        const covers = results.map(cover => ({
            ...cover,
            image: req.imagePath + cover.image_url,
        }));

        res.json(covers);
    });
}


export default search