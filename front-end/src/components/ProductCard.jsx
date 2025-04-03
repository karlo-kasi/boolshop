import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const p = product;

  return (
    <div className="row col g-3">
      <div className="col" key={p.id}>
        <Link to={`/cover/${p.slug}`} className="card text-decoration-none">
          <img src={p.image} className="card-img-top py-3" alt={p.name} />
          <div className="card-body">
            <h5 className="card-title">{p.name}</h5>
            <p className="card-text">
              <strong>{p.price}&euro;</strong>
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
