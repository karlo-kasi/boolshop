import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchProduct = () => {
    axios
      .get(`http://localhost:3000/products/${slug}`)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setLoading(false);
      });
  };

  useEffect(fetchProduct, [slug]);

  return (
    <>
  <div className="col" key={p.id}>
            <div className="card">
              <img src={p.image} className="card-img-top" alt={p.name} />
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">{p.description}</p>
                <p className="card-text">${p.price}</p>
              </div>
            </div>
          </div>    </>
  );
}
