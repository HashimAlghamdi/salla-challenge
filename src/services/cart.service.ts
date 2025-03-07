import { apiClient } from "@/config/client";
import { Cart, UpdateCartRequest } from "@/interfaces/Cart";

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const response = await apiClient.get<Cart>(
      `/cart/?token=${localStorage.getItem("token")}`
    );
    return response.data;
  },

  addToCart: async (data: UpdateCartRequest): Promise<Cart> => {
    const response = await apiClient.post<Cart>(
      `/cart/add/?token=${localStorage.getItem("token")}`,
      data
    );
    return response.data;
  },

  updateCartItem: async (
    itemId: number,
    data: UpdateCartRequest
  ): Promise<Cart> => {
    const response = await apiClient.put<Cart>(
      `/cart/update/${itemId}/?token=${localStorage.getItem("token")}`,
      data
    );
    return response.data;
  },

  deleteCartItem: async (itemId: number): Promise<void> => {
    await apiClient.delete(
      `/cart/delete/${itemId}/?token=${localStorage.getItem("token")}`
    );
  },
};
