import { Link } from 'react-router-dom';
import './Footer.css';


function Footer() {
  const categories = [
    { name: 'GPU', path: '/products/GPU' },
    { name: 'CPU', path: '/products/CPU' },
    { name: 'Motherboards', path: '/products/Motherboard' },
    { name: 'RAM', path: '/products/RAM' },
    { name: 'Cooling', path: '/products/Cooling' },
    { name: 'Storage', path: '/products/Storage' },
    { name: 'Cases', path: '/products/Cases' },
    { name: 'PSU', path: '/products/PSU' }
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">Overclock</h3>
          <p className="footer-text">
            Your trusted source for premium PC components. Build your dream PC with quality parts at competitive prices.
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Shop</h4>
          <div className="footer-shop-items">
            <Link to="/products" className="footer-link">All Products</Link>
            {categories.map((category) => (
              <Link key={category.name} to={category.path} className="footer-link">{category.name}</Link>
            ))}
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Follow Us</h4>
          <div className="footer-social-links">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
              <img src="/src/assets/icons/Facebook.png" alt="Facebook" className="social-icon" />
              <span>Facebook</span>
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
              <img src="/src/assets/icons/Instagram.png" alt="Instagram" className="social-icon" />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          © 2025 Overclock. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
