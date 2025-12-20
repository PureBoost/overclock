import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import './Products.css';

function Products() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('featured');

  // Fetch products from JSON Server
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/products');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        
        let filteredProducts = data;
        if (category) {
          filteredProducts = data.filter(
            product => product.category.toLowerCase() === category.toLowerCase()
          );
        }
        
        if (searchQuery) {
          filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        setProducts(filteredProducts);
        setError(null);
        
        window.scrollTo(0, 0);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, searchQuery]);

  const getPageTitle = () => {
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    if (category) return category;
    return 'All Products';
  };

  // Sort products based on selected sort option
  const getSortedProducts = (productsToSort) => {
    const sorted = [...productsToSort];
    
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'featured':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  };

  if (loading) {
    return (
      <div className="products-page">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-page">
        <div className="error">
          Error: {error}
          <p>Make sure JSON Server is running on port 3001</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-container">
        <div className="products-header">
          <h1 className="products-title">{getPageTitle()}</h1>
          <p className="products-count">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        {products.length > 0 && (
          <div className="sort-section">
            <label htmlFor="sort-select">Sort By: </label>
            <select 
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        )}

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="no-products">
            <p>No products found.</p>
            <Link to="/" className="back-link">← Back to Home</Link>
          </div>
        ) : (
          <div className="products-grid">
            {getSortedProducts(products).map((product) => (
              <Link 
                key={product.id} 
                to={`/product/${product.id}`}
                className="product-card"
              >
                <div className="product-image-container">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="product-image"
                  />
                </div>

                <div className="product-info">
                  <div className="product-category">{product.category}</div>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">
                    {product.description.substring(0, 80)}...
                  </p>

                  <div className="product-footer">
                    <span className="product-price">
                      ${product.price.toFixed(2)}
                    </span>
                    <button className="view-details-btn">
                      View Details
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
