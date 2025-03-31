import NewProductsList from "../components/NewProductsList"
import BestsellersList from "../components/BestsellersList"

export default function HomePage(){
    return(
        <>
            <h2>Sono la Home</h2>
            <NewProductsList />
            <BestsellersList />
        </>
    )
}