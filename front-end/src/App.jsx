import DefaultLayout from './layouts/DefaultLayout';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route Component={DefaultLayout}>

            <Route path="/" Component={HomePage} />
            <Route path="/:id" Component={ProductPage} />
            <Route path="/checkout" Component={CheckoutPage} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
