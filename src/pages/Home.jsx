import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import GraphicsIcon from '../assets/icons/GraphicsIcon.jpg';
import ProcessorIcon from '../assets/icons/ProcessorIcon.png';
import MotherboardIcon from '../assets/icons/MotherboardIcon.png';
import MemoryIcon from '../assets/icons/MemoryIcon.png';
import CoolingIcon from '../assets/icons/CoolingIcon.png';
import StorageIcon from '../assets/icons/StorageIcon.png';
import CaseIcon from '../assets/icons/CaseIcon.jpg';
import PowerSupplyIcon from '../assets/icons/PowerSupplyIcon.png';
import ShippingIcon from '../assets/icons/ShippingIcon.jpg';
import QualityIcon from '../assets/icons/QualityIcon.png';
import SupportIcon from '../assets/icons/SupportIcon.png';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [addingToCart, setAddingToCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Featured customer PC build
  const featuredPC = {
    id: 'featured-pc',
    customer: 'Lucas P.',
    name: 'Whiteout Gaming PC',
    images: [
      '/src/assets/FeaturedPc/CustPc1.jpeg',
      '/src/assets/FeaturedPc/CustPc2.jpeg',
      '/src/assets/FeaturedPc/CustPc3.jpeg'
    ],
    review: '"Overclock deserves an A+. The parts quality is top-notch, and the performance is outstanding. My games run smoothly at high settings, and the aesthetics of the white case with RGB lighting are stunning. Highly recommend for anyone looking to build a high-performance gaming PC!"',
    parts: [
      { productId: "5", quantity: 1 },  // GPU
      { productId: "7", quantity: 1 },  // CPU
      { productId: "18", quantity: 1 }, // RAM
      { productId: "12", quantity: 1 }, // MOTHERBOARD
      { productId: "24", quantity: 1 }, // COOLING
      { productId: "27", quantity: 1 }, // STORAGE
      { productId: "31", quantity: 1 },  // PSU
      { productId: "34", quantity: 1 }  // CASE
    ]
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? featuredPC.images.length - 1 : prev - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === featuredPC.images.length - 1 ? 0 : prev + 1
    );
  };

  // Add featured PC parts to cart
  const handleAddFeaturedPCToCart = async () => {
    console.log('Button clicked!');
    try {
      setAddingToCart(true);

      console.log('Fetching cart...');
      const testCartRes = await fetch('http://localhost:3001/cart');
      console.log('Cart response status:', testCartRes.status);
      
      if (!testCartRes.ok) {
        throw new Error(`JSON Server not responding. Status: ${testCartRes.status}`);
      }

      const currentCart = await testCartRes.json();
      console.log('Current cart items:', currentCart);

      // Fetch all products
      console.log('Fetching products...');
      const productsResponse = await fetch('http://localhost:3001/products');
      if (!productsResponse.ok) {
        throw new Error(`Products fetch failed: ${productsResponse.status}`);
      }
      const allProducts = await productsResponse.json();
      console.log('Available products:', allProducts.length);

      for (const part of featuredPC.parts) {
        const product = allProducts.find(p => p.id === part.productId);
        
        if (!product) {
          console.warn(`Product ${part.productId} not found in database`);
          continue;
        }

        // Check if item already exists in cart
        const existingItem = currentCart.find(item => item.productId === product.id);

        if (existingItem) {
          console.log(`Updating quantity for: ${product.name} (ID: ${product.id})`);
          
          const updateRes = await fetch(`http://localhost:3001/cart/${existingItem.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              quantity: existingItem.quantity + part.quantity
            })
          });

          if (!updateRes.ok) {
            throw new Error(`Failed to update ${product.name}: ${updateRes.status}`);
          }
          
          console.log(`Updated ${product.name} quantity to ${existingItem.quantity + part.quantity}`);
        } else {
          console.log(`Adding to cart: ${product.name} (ID: ${product.id})`);

          const addRes = await fetch('http://localhost:3001/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              quantity: part.quantity
            })
          });

          const responseData = await addRes.text();
          console.log(`Response for ${product.name}:`, addRes.status, responseData);

          if (!addRes.ok) {
            throw new Error(`Failed to add ${product.name}: ${addRes.status}`);
          }
        }
      }

      console.log('All items added successfully, navigating to cart');
      navigate('/cart');
    } catch (err) {
      console.error('Full error:', err);
      alert('Error: ' + err.message);
      setAddingToCart(false);
    }
  };

  // Define all PC part categories with descriptions
  const categories = [
    {
      name: 'GPU',
      title: 'Graphics Cards',
      description: 'High-performance graphics cards for gaming and rendering',
      icon: GraphicsIcon,
      path: '/products/GPU'
    },
    {
      name: 'CPU',
      title: 'Processors',
      description: 'Powerful CPUs from Intel and AMD for any workload',
      icon: ProcessorIcon,
      path: '/products/CPU'
    },
    {
      name: 'Motherboard',
      title: 'Motherboards',
      description: 'Quality motherboards with the latest features and connectivity',
      icon: MotherboardIcon,
      path: '/products/Motherboard'
    },
    {
      name: 'RAM',
      title: 'Memory',
      description: 'Fast DDR5 and DDR4 memory kits for smooth multitasking',
      icon: MemoryIcon,
      path: '/products/RAM'
    },
    {
      name: 'Cooling',
      title: 'Fans & Coolers',
      description: 'Keep your system cool with air and liquid cooling solutions',
      icon: CoolingIcon,
      path: '/products/Cooling'
    },
    {
      name: 'Storage',
      title: 'Storage',
      description: 'Fast NVMe SSDs and high-capacity hard drives',
      icon: StorageIcon,
      path: '/products/Storage'
    },
    {
      name: 'Cases',
      title: 'Cases',
      description: 'Premium PC cases with excellent airflow and aesthetics',
      icon: CaseIcon,
      path: '/products/Cases'
    },
    {
      name: 'PSU',
      title: 'Power Supplies',
      description: 'Reliable power supplies for stable and efficient operation',
      icon: PowerSupplyIcon,
      path: '/products/PSU'
    }
  ];

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Build Your Dream PC</h1>
          <p className="hero-subtitle">
            Premium PC components at competitive prices. Quality parts for gamers, creators, and enthusiasts.
          </p>
          <Link to="/products" className="hero-button">
            Browse All Products
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <h2 className="section-title">Shop by Category</h2>
        <br />
        <div className="categories-grid">
          {categories.map((category) => (
            <Link 
              key={category.name} 
              to={category.path} 
              className="category-card"
            >
              <div className="category-icon">
                <img src={category.icon} alt={category.title} />
              </div>
              <h3 className="category-title">{category.title}</h3>
              <p className="category-description">{category.description}</p>
              <span className="category-link">Shop Now →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Customer PC Section */}
      <section className="featured-pc-section">
        <h2 className="section-title">Featured Customer PC</h2>
        <br />
        <div className="featured-pc-container">
          <div className="featured-pc-image-wrapper">
            <button 
              onClick={goToPreviousImage}
              className="featured-pc-arrow featured-pc-arrow-left"
              aria-label="Previous image"
            >
              ←
            </button>
            <div className="featured-pc-image">
              <img src={featuredPC.images[currentImageIndex]} alt={`${featuredPC.name} - image ${currentImageIndex + 1}`} />
            </div>
            <button 
              onClick={goToNextImage}
              className="featured-pc-arrow featured-pc-arrow-right"
              aria-label="Next image"
            >
              →
            </button>
            <div className="featured-pc-image-counter">
              {currentImageIndex + 1} / {featuredPC.images.length}
            </div>
          </div>
          <div className="featured-pc-content">
            <h3 className="featured-pc-name">{featuredPC.customer}</h3>
            <h3 className="featured-pc-name">{featuredPC.name}</h3>
            <p className="featured-pc-review">{featuredPC.review}</p>
            <button 
              onClick={handleAddFeaturedPCToCart}
              disabled={addingToCart}
              className="featured-pc-btn"
            >
              {addingToCart ? 'Adding to Cart...' : 'Add This Build to Cart'}
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">
            <img src={ShippingIcon} alt="Fast Shipping" className="shipping-icon" />
          </div>
          <h3>Fast Shipping</h3>
          <p>Free delivery on orders over $100</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">
            <img src={QualityIcon} alt="Quality Guaranteed" />
          </div>
          <h3>Quality Guaranteed</h3>
          <p>All products are brand new and authentic</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">
            <img src={SupportIcon} alt="Expert Support" />
          </div>
          <h3>Expert Support</h3>
          <p>24/7 customer service for your needs</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
