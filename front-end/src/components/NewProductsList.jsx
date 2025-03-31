import { useState, useEffect } from "react"

export default function NewProductsList() {
    const url = import.meta.env.VITE_INDEX_ROUTE
    const [newProducts, setNewProducts] = useState([]);

    const fetchNewProducts = () => {
        fetch(url)
            .then(res => res.json())
            .then(data => {
                const newArrivals = data.filter(d => {
                    return d.id > 10 && d.id < 16
                });
                setNewProducts(newArrivals)
            })
            .catch(err => console.log(err))
    }

    useEffect(fetchNewProducts, [])

    return (
        <div>
            <h3>Ultimi arrivi</h3>
            <ul>
                {newProducts.map(p => {
                    return <li key={p.id}>{p.name}</li>
                })}
            </ul>
        </div>
        
    )
}