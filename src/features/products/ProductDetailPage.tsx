import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, ApiError } from '../../services/api';
import { Product } from '../../types/product';
import { currencyFormatter, normalizeProduct } from './productUtils';

const dateFormatter = new Intl.DateTimeFormat('tr-TR', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Ürün bulunamadı.');
      setLoading(false);
      return;
    }

    let isActive = true;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.products.get(id);
        if (!isActive) return;
        setProduct(normalizeProduct(data));
      } catch (err) {
        const apiError = err as ApiError;
        const message =
          apiError.status === 404
            ? 'Ürün bulunamadı.'
            : apiError.message || 'Ürün detayı alınamadı.';
        if (isActive) {
          setError(message);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      isActive = false;
    };
  }, [id]);

  const detailItems = useMemo(() => {
    if (!product) return [] as { label: string; value: string }[];

    const createdAt = product.createdAt ? dateFormatter.format(new Date(product.createdAt)) : '—';
    const updatedAt = product.updatedAt ? dateFormatter.format(new Date(product.updatedAt)) : '—';

    return [
      { label: 'Fiyat', value: currencyFormatter.format(product.price) },
      { label: 'Oluşturulma', value: createdAt },
      { label: 'Güncellenme', value: updatedAt },
    ];
  }, [product]);

  return (
    <div className="space-y-6">
      <section className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-steel">Ürün Detayı</p>
            <h2 className="font-display text-2xl font-semibold">Detay Görünümü</h2>
          </div>
          <Link className="btn btn-ghost" to="/products">
            Listeye Dön
          </Link>
        </div>
      </section>

      {loading ? (
        <div className="card p-6 text-sm text-steel">Ürün detayı yükleniyor...</div>
      ) : error ? (
        <div className="card p-6 text-sm text-red-600">{error}</div>
      ) : product ? (
        <section className="card p-6 space-y-5">
          <div>
            <h3 className="text-xl font-semibold text-ink">{product.name}</h3>
            <p className="mt-2 text-sm text-steel">
              {product.description || 'Açıklama bulunmuyor.'}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {detailItems.map((item) => (
              <div key={item.label} className="rounded-2xl border border-line bg-mist/60 p-4">
                <p className="text-xs font-semibold uppercase text-steel">{item.label}</p>
                <p className="mt-2 text-sm font-semibold text-ink">{item.value}</p>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="card p-6 text-sm text-steel">Gösterilecek ürün bulunamadı.</div>
      )}
    </div>
  );
}
