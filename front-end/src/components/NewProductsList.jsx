import { useState, useEffect } from "react"
import ProductCard from "./ProductCard";
import axios from "axios";

export default function NewProductsList() {
    const url = import.meta.env.VITE_INDEX_ROUTE
    const [newProducts, setNewProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios
            .get(url)
            .then((response) => {
                const newProductsArray = response.data.filter(d => d.id > 10 && d.id < 16);
                setNewProducts(newProductsArray)
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
        <div className="mb-5">
            <h2>Ultimi arrivi</h2>
            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 justify-content-center">
                {newProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
        </div>

    )
}