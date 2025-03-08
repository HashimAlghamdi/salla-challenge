import { apiClient } from "@/utils/client";
import { Category } from "@/interfaces/Category";

export const categoriesService = {
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>("/category/");
    return response.data;
  },
};
