import { useState, useEffect } from "react";
import {Link} from "react-router-dom"

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


    return (
        <div>
            <h3>I più venduti</h3>
            <ul>
                {bestsellers.map(b => {
                    return (
                        <li key={b.id}>
                            <Link to={`/${b.slug}`}>{b.name} ({b.price}&euro;)</Link>
                        </li>
                    ) 
                })}
            </ul>
        </div>
    )
}