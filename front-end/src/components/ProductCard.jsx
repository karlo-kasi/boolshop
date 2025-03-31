import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ProductCard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3000/cover")
      .then((response) => {
        console.log(response.data)
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="row row-cols-1 row-cols-md-2 g-4">
      {products.map((p) => {
        return (
          <div className="col" key={p.id}>
            <Link to={`/${p.slug}`} className="card text-decoration-none">
              <img src={p.image} className="card-img-top" alt={p.name} />
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">{p.description}</p>
                <p className="card-text">${p.price}</p>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
