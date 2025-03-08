import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Cart from '../page';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

jest.mock('@/contexts/CartContext');
jest.mock('@/contexts/AuthContext');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

describe('Cart Page', () => {
  const mockCartItems = [
    {
      id: 1,
      product: {
        id: 1,
        name: 'Test Product',
        price: 99.99,
        imageURL: 'test.jpg',
        description: 'Test Description',
        categoryId: 1,
      },
      quantity: 2,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    (useAuth as jest.Mock).mockReturnValue({
      isLoggedIn: true,
    });

    (useCart as jest.Mock).mockReturnValue({
      cart: { cartItems: mockCartItems },
      isLoading: false,
      error: null,
      updateCartItem: jest.fn(),
      deleteCartItem: jest.fn(),
    });
  });

  it('shows loading state', () => {
    (useCart as jest.Mock).mockReturnValue({
      cart: null,
      isLoading: true,
      error: null,
    });

    render(<Cart />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('shows error message when there is an error', () => {
    (useCart as jest.Mock).mockReturnValue({
      cart: null,
      isLoading: false,
      error: 'Error loading cart',
    });

    render(<Cart />);
    expect(screen.getByText('Error loading cart')).toBeInTheDocument();
  });

  it('shows login message when not logged in', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoggedIn: false,
    });

    render(<Cart />);
    expect(screen.getByText('يرجى تسجيل الدخول لعرض السلة')).toBeInTheDocument();
  });

  it('shows empty cart message when cart is empty', () => {
    (useCart as jest.Mock).mockReturnValue({
      cart: { cartItems: [] },
      isLoading: false,
      error: null,
    });

    render(<Cart />);
    expect(screen.getByText('السلة فارغة')).toBeInTheDocument();
  });

  it('renders cart items correctly', () => {
    render(<Cart />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('99.99')).toBeInTheDocument();
    expect(screen.getByRole('spinbutton')).toHaveValue(2);
  });

  it('handles quantity update correctly', async () => {
    const mockUpdateCartItem = jest.fn();
    (useCart as jest.Mock).mockReturnValue({
      cart: { cartItems: mockCartItems },
      isLoading: false,
      error: null,
      updateCartItem: mockUpdateCartItem,
      deleteCartItem: jest.fn(),
    });

    render(<Cart />);
    const quantityInput = screen.getByRole('spinbutton');
    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, '3');

    await waitFor(() => {
      expect(mockUpdateCartItem).toHaveBeenCalledWith(1, 1, 3);
    });
  });

  it('handles delete item correctly', async () => {
    const mockDeleteCartItem = jest.fn();
    (useCart as jest.Mock).mockReturnValue({
      cart: { cartItems: mockCartItems },
      isLoading: false,
      error: null,
      updateCartItem: jest.fn(),
      deleteCartItem: mockDeleteCartItem,
    });

    render(<Cart />);
    const deleteButton = screen.getByTitle('حذف');
    await userEvent.click(deleteButton);

    expect(mockDeleteCartItem).toHaveBeenCalledWith(1);
  });
});
