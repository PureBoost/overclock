import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';


function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
  });

  // Fetch cart items
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch('http://localhost:3001/cart');
      const data = await response.json();
      setCartItems(data);
      
      if (data.length === 0) {
        navigate('/cart');
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  // Calculate shipping cost
  const calculateShipping = () => {
    const subtotal = calculateTotal();
    return subtotal >= 100 ? 0 : 15;
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Prevent numbers in name and city fields
    if ((name === 'fullName' || name === 'city') && /\d/.test(value)) {
      return;
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.email || !formData.address) {
      alert('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);

    setTimeout(async () => {
      try {
        for (const item of cartItems) {
          await fetch(`http://localhost:3001/cart/${item.id}`, {
            method: 'DELETE'
          });
        }
        
        setOrderComplete(true);
      } catch (err) {
        console.error('Error processing order:', err);
        alert('Failed to process order. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }, 2000);
  };

  // Order confirmation view
  if (orderComplete) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="order-confirmation">
            <div className="confirmation-icon">✓</div>
            <h1 className="confirmation-title">Order Confirmed!</h1>
            <p className="confirmation-message">
              Thank you for your order, {formData.fullName}!
            </p>
            <p className="confirmation-details">
              A confirmation email has been sent to <strong>{formData.email}</strong>
            </p>
            <div className="order-summary-box">
              <h3>Order Summary</h3>
              <p>Total Amount: <strong>${(calculateTotal() + calculateShipping() + (calculateTotal() * 0.15)).toFixed(2)}</strong></p>
              <p>Items Ordered: <strong>{cartItems.length}</strong></p>
            </div>
            <button onClick={() => navigate('/')} className="home-btn">
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="checkout-page">
        <div className="loading">Loading checkout...</div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-content">
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="checkout-form">
              <section className="form-section">
                <h2 className="section-title">Shipping Information</h2>
                
                <div className="form-group">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="John Doe"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address">Street Address *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="123 Main Road"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      placeholder="Paradise"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="zipCode">Postal Code *</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      placeholder="A1A1A1"
                    />
                  </div>
                </div>
              </section>

              {/* Payment Information */}
              <section className="form-section">
                <h2 className="section-title">Payment Information</h2>
                
                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number *</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="1234 5678 1234 5678"
                    maxLength="19"
                  />
                </div>
              </section>

              <button 
                type="submit" 
                className="submit-order-btn"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          <div className="order-summary-sidebar">
            <h2 className="summary-title">Order Summary</h2>
            
            <div className="summary-items">
              {cartItems.map((item) => (
                <div key={item.id} className="summary-item">
                  <img src={item.image} alt={item.name} className="summary-item-image" />
                  <div className="summary-item-details">
                    <div className="summary-item-name">{item.name}</div>
                    <div className="summary-item-qty">Qty: {item.quantity}</div>
                  </div>
                  <div className="summary-item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span className="free-text">
                {calculateShipping() === 0 ? 'FREE' : `$${calculateShipping().toFixed(2)}`}
              </span>
            </div>

            <div className="summary-row">
              <span>Tax (15%)</span>
              <span>${(calculateTotal() * 0.15).toFixed(2)}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row summary-total">
              <span>Total</span>
              <span>${(calculateTotal() + calculateShipping() + (calculateTotal() * 0.15)).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
