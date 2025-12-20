import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetail.css';


function ProductDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  // Fetch product details from JSON Server
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/products/${id}`);
        
        if (!response.ok) {
          throw new Error('Product not found');
        }
        
        const data = await response.json();
        setProduct(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      
      // Check if product already in cart
      const cartResponse = await fetch('http://localhost:3001/cart');
      const cartItems = await cartResponse.json();
      const existingItem = cartItems.find(item => item.productId === product.id);
      
      if (existingItem) {
        await fetch(`http://localhost:3001/cart/${existingItem.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quantity: existingItem.quantity + quantity
          })
        });
      } else {
        await fetch('http://localhost:3001/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
          })
        });
      }
      
      // Navigate to cart page
      navigate('/cart');
    } catch (err) {
      alert('Failed to add to cart. Please try again.');
      console.error('Error adding to cart:', err);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="loading">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="error">
          {error || 'Product not found'}
          <button onClick={() => navigate('/products')} className="back-btn">
            ← Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="breadcrumb">
          <button onClick={() => navigate('/')} className="breadcrumb-link">Home</button>
          <span className="breadcrumb-separator">›</span>
          <button onClick={() => navigate(`/products/${product.category}`)} className="breadcrumb-link">
            {product.category}
          </button>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{product.name}</span>
        </div>

        {/* Main Product Section */}
        <div className="product-detail-grid">
          <div className="product-image-section">
            <div className="main-image-container">
              <img src={product.image} alt={product.name} className="main-image" />
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info-section">
            <div className="product-category-badge">{product.category}</div>
            <h1 className="product-title">{product.name}</h1>
            
            {/* Price */}
            <div className="price-stock-section">
              <div className="price-container">
                <span className="price">${product.price.toFixed(2)}</span>
              </div>
            </div>

            {/* Description */}
            <div className="description-section">
              <h2 className="section-heading">Description</h2>
              <p className="product-description">{product.description}</p>
            </div>

            <div className="cart-actions">
              <div className="quantity-selector">
                <label htmlFor="quantity" className="quantity-label">Quantity:</label>
                <div className="quantity-controls">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="quantity-btn"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <input 
                    id="quantity"
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    className="quantity-input"
                  />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
              </div>

              <button 
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="add-to-cart-btn"
              >
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
