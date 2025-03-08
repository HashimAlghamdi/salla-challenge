import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCard from '../components/ProductCard';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useCategories } from '@/contexts/CategoriesContext';
import { useImageError } from '@/hooks/useImageError';

// Mock the hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/contexts/CartContext', () => ({
  useCart: jest.fn(),
}));

jest.mock('@/contexts/CategoriesContext', () => ({
  useCategories: jest.fn(),
}));

jest.mock('@/hooks/useImageError', () => ({
  useImageError: jest.fn(),
}));

describe('ProductCard', () => {
  const mockProduct = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    imageURL: 'test.jpg',
    categoryId: 1,
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup default mock returns
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });

    (useAuth as jest.Mock).mockReturnValue({
      isLoggedIn: true,
    });

    (useCart as jest.Mock).mockReturnValue({
      cart: { cartItems: [] },
      addToCart: jest.fn(),
      updateCartItem: jest.fn(),
      deleteCartItem: jest.fn(),
    });

    (useCategories as jest.Mock).mockReturnValue({
      categories: [
        {
          id: 1,
          categoryName: 'Test Category',
        },
      ],
    });

    (useImageError as jest.Mock).mockReturnValue({
      handleImageError: jest.fn(),
      hasImageError: jest.fn().mockReturnValue(false),
    });
  });

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText('Test Category')).toBeInTheDocument();
    expect(screen.getByText('99.99')).toBeInTheDocument();
  });

  it('redirects to login when adding to cart while logged out', async () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useAuth as jest.Mock).mockReturnValue({ isLoggedIn: false });

    render(<ProductCard product={mockProduct} />);

    const addButton = screen.getByRole('button', { name: /إضافة للسلة/i });
    await userEvent.click(addButton);

    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/login?redirect=/'));
  });

  it('shows quantity controls when item is in cart', () => {
    (useCart as jest.Mock).mockReturnValue({
      cart: {
        cartItems: [
          {
            id: 1,
            product: mockProduct,
            quantity: 2,
          },
        ],
      },
      updateCartItem: jest.fn(),
      deleteCartItem: jest.fn(),
    });

    render(<ProductCard product={mockProduct} />);
    expect(screen.getByRole('spinbutton')).toHaveValue(2);
  });

  it('handles image error correctly', () => {
    const mockHandleImageError = jest.fn();
    (useImageError as jest.Mock).mockReturnValue({
      handleImageError: mockHandleImageError,
      hasImageError: jest.fn().mockReturnValue(true),
    });

    render(<ProductCard product={mockProduct} />);
    const img = screen.getByRole('img');
    fireEvent.error(img);

    expect(mockHandleImageError).toHaveBeenCalled();
  });
});
