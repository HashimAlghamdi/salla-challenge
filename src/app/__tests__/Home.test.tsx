import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomeView from '../page';
import { useProducts } from '@/contexts/ProductsContext';
import { useSearchParams } from 'next/navigation';

jest.mock('@/contexts/ProductsContext');
jest.mock('@/contexts/CategoriesContext', () => ({
  useCategories: jest.fn(() => ({
    categories: [
      { id: 1, categoryName: 'Category 1' },
      { id: 2, categoryName: 'Category 2' },
    ],
  })),
}));

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

describe('HomeView', () => {
  const mockProducts = [
    {
      id: 1,
      name: 'Test Product 1',
      description: 'Description 1',
      price: 99.99,
      imageURL: 'test1.jpg',
      categoryId: 1,
    },
    {
      id: 2,
      name: 'Test Product 2',
      description: 'Description 2',
      price: 149.99,
      imageURL: 'test2.jpg',
      categoryId: 2,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    (useProducts as jest.Mock).mockReturnValue({
      products: mockProducts,
      isLoading: false,
      error: null,
    });

    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn(),
    });
  });

  it('shows loading state', () => {
    (useProducts as jest.Mock).mockReturnValue({
      products: [],
      isLoading: true,
      error: null,
    });

    render(<HomeView />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('shows error message', () => {
    (useProducts as jest.Mock).mockReturnValue({
      products: [],
      isLoading: false,
      error: 'Error loading products',
    });

    render(<HomeView />);
    expect(screen.getByText('Error loading products')).toBeInTheDocument();
  });

  it('renders products correctly', () => {
    render(<HomeView />);
    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();
  });

  it('filters products by search', async () => {
    render(<HomeView />);
    const searchInput = screen.getByPlaceholderText('ابحث عن منتج');
    await userEvent.type(searchInput, 'Test Product 1');

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Product 2')).not.toBeInTheDocument();
    });
  });

  it('filters products by category', async () => {
    render(<HomeView />);
    const categorySelect = screen.getByRole('combobox');
    await userEvent.selectOptions(categorySelect, '1');

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Product 2')).not.toBeInTheDocument();
    });
  });

  it('shows product carousel', () => {
    render(<HomeView />);
    expect(screen.getByTestId('product-carousel')).toBeInTheDocument();
  });

  it('handles pagination correctly', async () => {
    render(<HomeView />);
    const nextPageButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextPageButton);

    // Verify page change effects
    // Add assertions based on your pagination implementation
  });
});
