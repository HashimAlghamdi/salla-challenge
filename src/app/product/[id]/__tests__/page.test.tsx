import { render, screen } from "@testing-library/react";
import Product from "../page";
import { useProducts } from "@/contexts/ProductsContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

jest.mock("@/contexts/ProductsContext");
jest.mock("@/contexts/CartContext");
jest.mock("@/contexts/AuthContext");
jest.mock("next/navigation", () => ({
  useParams: () => ({ id: "1" }),
  useRouter: () => ({ push: jest.fn() }),
}));

describe("Product Page", () => {
  const mockProduct = {
    id: 1,
    name: "Test Product",
    description: "Test Description",
    price: 99.99,
    imageURL: "test.jpg",
    categoryId: 1,
  };

  beforeEach(() => {
    (useProducts as jest.Mock).mockReturnValue({
      products: [mockProduct],
      isLoading: false,
    });
    (useCart as jest.Mock).mockReturnValue({
      cart: { cartItems: [] },
      addToCart: jest.fn(),
      updateCartItem: jest.fn(),
      deleteCartItem: jest.fn(),
    });
    (useAuth as jest.Mock).mockReturnValue({
      isLoggedIn: true,
    });
  });

  it("renders product details correctly", () => {
    render(<Product />);
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("99.99")).toBeInTheDocument();
  });

  it("shows add to cart button when item is not in cart", () => {
    render(<Product />);
    expect(screen.getByText("إضافة للسلة")).toBeInTheDocument();
  });

  it("shows quantity controls when item is in cart", () => {
    (useCart as jest.Mock).mockReturnValue({
      cart: {
        cartItems: [
          {
            id: 1,
            product: mockProduct,
            quantity: 1,
          },
        ],
      },
      updateCartItem: jest.fn(),
      deleteCartItem: jest.fn(),
    });

    render(<Product />);
    expect(screen.getByRole("spinbutton")).toHaveValue(1);
  });
});
