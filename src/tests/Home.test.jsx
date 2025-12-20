import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Home from '../pages/Home';

/**
 * Home Component Unit Tests
 * Tests the home page rendering and category display
 */
describe('Home Component', () => {
  // Mock fetch to prevent API calls during testing
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Helper function to render Home with Router
  const renderHome = () => {
    return render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
  };

  it('renders the hero section with title and subtitle', () => {
    renderHome();
    
    // Check for hero title
    const heroTitle = screen.getByText(/build your dream pc/i);
    expect(heroTitle).toBeInTheDocument();
    
    // Check for hero subtitle
    const heroSubtitle = screen.getByText(/premium pc components at competitive prices/i);
    expect(heroSubtitle).toBeInTheDocument();
    
    // Check for Browse button
    const browseButton = screen.getByRole('link', { name: /browse all products/i });
    expect(browseButton).toBeInTheDocument();
  });

  it('renders all 8 product categories', () => {
    renderHome();
    
    // Check for "Shop by Category" heading
    const categoryHeading = screen.getByText(/shop by category/i);
    expect(categoryHeading).toBeInTheDocument();
    
    // Check for all 8 category titles (using heading role to be specific)
    expect(screen.getByRole('heading', { name: /graphics cards/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /processors/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /motherboards/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /memory/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /fans & coolers/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /storage/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /cases/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /power supplies/i })).toBeInTheDocument();
  });

  it('renders category cards with correct links', () => {
    renderHome();
    
    // Check that GPU category links to correct path
    const gpuLink = screen.getByRole('link', { name: /graphics cards/i });
    expect(gpuLink).toHaveAttribute('href', '/products/GPU');
    
    // Check that CPU category links to correct path
    const cpuLink = screen.getByRole('link', { name: /processors/i });
    expect(cpuLink).toHaveAttribute('href', '/products/CPU');
    
    // Check for "Shop Now" text on category cards
    const shopNowLinks = screen.getAllByText(/shop now/i);
    expect(shopNowLinks.length).toBeGreaterThan(0);
  });

  it('renders the features section', () => {
    renderHome();
    
    // Check for feature headings
    expect(screen.getByText(/fast shipping/i)).toBeInTheDocument();
    expect(screen.getByText(/quality guaranteed/i)).toBeInTheDocument();
    expect(screen.getByText(/expert support/i)).toBeInTheDocument();
    
    // Check for free shipping text
    expect(screen.getByText(/free delivery on orders over \$100/i)).toBeInTheDocument();
  });
});
