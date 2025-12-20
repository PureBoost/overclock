import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';
import CartIcon from '../assets/icons/CartIcon.png';


function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cart items from JSON Server
  useEffect(() => {
    fetchCart();

    window.scrollTo(0, 0);
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/cart');
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      
      const data = await response.json();
      setCartItems(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await fetch(`http://localhost:3001/cart/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity })
      });
      
      fetchCart();
    } catch (err) {
      alert('Failed to update quantity');
      console.error('Error updating quantity:', err);
    }
  };

  // Remove item from cart
  const removeItem = async (itemId) => {
    try {
      await fetch(`http://localhost:3001/cart/${itemId}`, {
        method: 'DELETE'
      });
      
      fetchCart();
    } catch (err) {
      alert('Failed to remove item');
      console.error('Error removing item:', err);
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  // Calculate total items
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Calculate shipping cost
  const calculateShipping = () => {
    const subtotal = calculateTotal();
    return subtotal >= 100 ? 0 : 15;
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="loading">Loading cart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-page">
        <div className="error">
          Error: {error}
          <p>Make sure JSON Server is running on port 3001</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-title">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <img src={CartIcon} alt="Empty cart" className="empty-cart-icon" />
            <h2>Your cart is empty</h2>
            <p>Add some PC parts to get started!</p>
            <Link to="/products" className="continue-shopping-btn">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            {/* Cart Items */}
            <div className="cart-items-section">
              <div className="cart-header">
                <span>{getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in cart</span>
              </div>

              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">

                  <Link to={`/product/${item.productId}`} className="item-image-link">
                    <img src={item.image} alt={item.name} className="item-image" />
                  </Link>

                  <div className="item-details">
                    <Link to={`/product/${item.productId}`} className="item-name">
                      {item.name}
                    </Link>
                    <div className="item-price-mobile">
                      ${item.price.toFixed(2)} each
                    </div>
                  </div>

                  <div className="item-quantity">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="quantity-btn"
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <input 
                      type="number" 
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                      min="1"
                      className="quantity-input"
                    />
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>


                  <div className="item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>


                  <button 
                    onClick={() => removeItem(item.id)}
                    className="remove-btn"
                    title="Remove item"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <h2 className="summary-title">Order Summary</h2>
              
              <div className="summary-row">
                <span>Product Subtotal ({getTotalItems()} items)</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span className="free-shipping">
                  {calculateShipping() === 0 ? 'FREE' : `$${calculateShipping().toFixed(2)}`}
                </span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row summary-total">
                <span>Subtotal</span>
                <span>${(calculateTotal() + calculateShipping()).toFixed(2)}</span>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="checkout-btn"
              >
                Proceed to Checkout
              </button>

              <Link to="/products" className="continue-shopping-link">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
