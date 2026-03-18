export type Product = {
  id: string | number;
  name: string;
  description?: string | null;
  price: number;
  createdAt?: string;
  updatedAt?: string;
};
