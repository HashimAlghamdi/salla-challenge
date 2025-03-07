import { Product } from "./Product";

export interface Category {
  categoryName: string;
  description: string;
  id: number;
  imageURL: string;
  products: Product[];
}
