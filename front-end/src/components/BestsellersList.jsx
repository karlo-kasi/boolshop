import { useState, useEffect } from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import ProductCard from "./ProductCard";

export default function BestsellersList() {
        const url = import.meta.env.VITE_INDEX_ROUTE;
        const [bestsellers, setBestsellers] = useState([]);
    
        const fetchBestsellers = () => {
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    const bestsellersArray = data.filter(d => {
                        return d.id === 3 || d.id === 8 || d.id === 11 || d.id === 10 || d.id === 5
                    });
                    setBestsellers(bestsellersArray)
                })
                .catch(err => console.log(err))
        }
    
        useEffect(fetchBestsellers, [])

        const [loading, setLoading] = useState(true);

        useEffect(() => {
            setLoading(true);
            axios
                .get(url)
                .then((response) => {
                    const bestsellersArray = response.data.filter(d => d.id === 3 || d.id === 8 || d.id === 11 || d.id === 10 || d.id === 5);
                    setBestsellers(bestsellersArray)
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
        <div className="mb-4">
            <h3>I più venduti</h3>
            <ul>
                {bestsellers.map(p => <ProductCard key={p.id} product={p} />)}
            </ul>
        </div>
    )
}