import { Link } from 'react-router-dom';
import { useState } from 'react';
import Logo from '../assets/icons/Logo.png';
import './Navbar.css';

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');


  const categories = [
    { name: 'All', path: '/products' },
    { name: 'GPU', path: '/products/GPU' },
    { name: 'CPU', path: '/products/CPU' },
    { name: 'Motherboard', path: '/products/Motherboard' },
    { name: 'RAM', path: '/products/RAM' },
    { name: 'Storage', path: '/products/Storage' },
    { name: 'Cooling', path: '/products/Cooling' },
    { name: 'Cases', path: '/products/Cases' },
    { name: 'PSU', path: '/products/PSU' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${searchQuery}`;
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link to="/" className="navbar-logo">
          <img src={Logo} alt="PC Part Store Logo" className="logo-image" />
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          
          {/* Categories Dropdown */}
          <div 
            className="nav-dropdown"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button className="nav-link dropdown-toggle">
              Categories
              <span className="dropdown-arrow">▼</span>
            </button>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                {categories.map((category) => (
                  <Link 
                    key={category.name} 
                    to={category.path} 
                    className="dropdown-item"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/cart" className="nav-link">Cart</Link>
        </div>

        {/* Search Bar */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search PC parts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button" aria-label="Search">
            <svg
              className="search-icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="6" />
              <line x1="16" y1="16" x2="21" y2="21" />
            </svg>
          </button>
        </form>
      </div>
    </nav>
  );
}

export default Navbar;
