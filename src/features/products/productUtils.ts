import { Product } from '../../types/product';

export const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
});

export function toNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return 0;
}

export function normalizeProduct(item: any): Product {
  return {
    id: item.id ?? item._id ?? item.uuid ?? item.code ?? Math.random().toString(36),
    name: item.name ?? item.title ?? 'İsimsiz Ürün',
    description: item.description ?? item.detail ?? null,
    price: toNumber(item.price ?? item.amount),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}
