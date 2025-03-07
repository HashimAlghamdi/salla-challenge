import { Product } from "./Product";

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export interface Cart {
  cartItems: CartItem[];
  totalCost: number;
}

export interface UpdateCartRequest {
  id?: number;
  productId: number;
  quantity: number;
}
export interface CategoryOption {
  value: number | string;
  label: string;
}
export interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateCartItem: (
    itemId: number,
    productId: number,
    quantity: number
  ) => Promise<void>;
  deleteCartItem: (itemId: number) => Promise<void>;
  fetchCart: () => Promise<void>;
  resetCart: () => void;
}