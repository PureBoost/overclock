import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Navbar from '../components/Navbar';

/**
 * Navbar Component Unit Tests
 * Tests the navigation bar rendering and structure
 */
describe('Navbar Component', () => {
  // Helper function to render Navbar with Router
  const renderNavbar = () => {
    return render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
  };

  it('renders the Overclock logo/brand name', () => {
    renderNavbar();
    const logo = screen.getByAltText(/PC Part Store Logo/i);
    expect(logo).toBeInTheDocument();
  });

  it('renders all main navigation links', () => {
    renderNavbar();
    
    // Check that Home link exists
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');

    // Check that Cart link exists
    const cartLink = screen.getByRole('link', { name: /cart/i });
    expect(cartLink).toBeInTheDocument();
    expect(cartLink).toHaveAttribute('href', '/cart');
  });

  it('renders the categories dropdown button', () => {
    renderNavbar();
    
    // Check for Categories dropdown
    const categoriesButton = screen.getByRole('button', { name: /categories/i });
    expect(categoriesButton).toBeInTheDocument();
  });

  it('renders the search form', () => {
    renderNavbar();
    
    // Check that search input exists
    const searchInput = screen.getByPlaceholderText(/search pc parts/i);
    expect(searchInput).toBeInTheDocument();
    
    // Check that search button exists
    const searchButton = screen.getByRole('button', { name: /search/i });
    expect(searchButton).toBeInTheDocument();
  });
});
