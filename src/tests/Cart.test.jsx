import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Cart from '../pages/Cart';

/**
 * Cart Component Unit Tests
 * Tests the shopping cart functionality including empty state and calculations
 */
describe('Cart Component', () => {
  // Helper function to render Cart with Router
  const renderCart = () => {
    return render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    // Mock fetch API
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('displays empty cart message when cart is empty', async () => {
    // Mock empty cart response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    renderCart();

    // Wait for the empty cart message to appear
    await waitFor(() => {
      expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    });

    // Check for "Browse Products" button
    const browseButton = screen.getByRole('link', { name: /browse products/i });
    expect(browseButton).toBeInTheDocument();
  });

  it('displays cart items when cart has products', async () => {
    // Mock cart with items
    const mockCartItems = [
      {
        id: 1,
        productId: "1",
        name: "NVIDIA RTX 4090",
        price: 1599.99,
        quantity: 1,
        image: "/test-image.jpg"
      },
      {
        id: 2,
        productId: "7",
        name: "Intel Core i9-14900K",
        price: 589.99,
        quantity: 2,
        image: "/test-image2.jpg"
      }
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCartItems
    });

    renderCart();

    // Wait for cart items to load
    await waitFor(() => {
      expect(screen.getByText(/NVIDIA RTX 4090/i)).toBeInTheDocument();
      expect(screen.getByText(/Intel Core i9-14900K/i)).toBeInTheDocument();
    });

    // Check that item count displays correctly
    expect(screen.getByText(/3 items in cart/i)).toBeInTheDocument();
  });

  it('displays order summary with correct totals', async () => {
    // Mock cart with items
    const mockCartItems = [
      {
        id: 1,
        productId: "1",
        name: "Test Product",
        price: 100.00,
        quantity: 2,
        image: "/test.jpg"
      }
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCartItems
    });

    renderCart();

    // Wait for order summary to appear
    await waitFor(() => {
      expect(screen.getByText(/order summary/i)).toBeInTheDocument();
    });

    // Check for product subtotal text
    expect(screen.getByText(/product subtotal \(2 items\)/i)).toBeInTheDocument();

    // Check for shipping (should be FREE since > $100)
    expect(screen.getByText(/FREE/i)).toBeInTheDocument();

    // Cart should not show tax and should display combined subtotal (with shipping)
    expect(screen.queryByText(/tax \(15%\)/i)).toBeNull();
    expect(screen.getAllByText(/subtotal/i).length).toBeGreaterThan(0);

    // Check for "Proceed to Checkout" button
    const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i });
    expect(checkoutButton).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    // Mock a delayed response
    global.fetch.mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => []
      }), 100))
    );

    renderCart();

    // Check for loading message
    expect(screen.getByText(/loading cart/i)).toBeInTheDocument();
  });
});
