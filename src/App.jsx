import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import './App.css';


function App() {
  return (
    <Router>
      <div className="app">
        {/* Navigation */}
        <Navbar />
        
        {/* Main content */}
        <main className="main-content">
          <Routes>
            {/* Home page  */}
            <Route path="/" element={<Home />} />
            
            {/* All products page */}
            <Route path="/products" element={<Products />} />
            
            {/* Products filtered by category */}
            <Route path="/products/:category" element={<Products />} />
            
            {/* Individual product detail page */}
            <Route path="/product/:id" element={<ProductDetail />} />
            
            {/* Shopping cart page */}
            <Route path="/cart" element={<Cart />} />
            
            {/* Checkout page */}
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
