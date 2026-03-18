import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, ApiError } from '../../services/api';
import { Product } from '../../types/product';
import { ProductForm } from './ProductForm';
import { currencyFormatter, normalizeProduct } from './productUtils';

const DEFAULT_PAGE_SIZE = 3;

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = DEFAULT_PAGE_SIZE;
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.products.list();
      const normalized = data.map(normalizeProduct);
      setProducts(normalized);
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.status === 401) return;
      setError(apiError.message || 'Ürünler getirilemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const term = search.toLowerCase();
    return products.filter((item) =>
      `${item.name} ${item.description ?? ''}`.toLowerCase().includes(term)
    );
  }, [products, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const openCreate = () => {
    setActiveProduct(null);
    setPanelOpen(true);
  };

  const openEdit = (product: Product) => {
    setActiveProduct(product);
    setPanelOpen(true);
  };

  const closePanel = () => {
    setPanelOpen(false);
  };

  const handleSave = async (payload: { name: string; description: string; price: number }) => {
    setSaving(true);
    setError(null);
    try {
      if (activeProduct) {
        const updated = await api.products.update(activeProduct.id, payload);
        setProducts((prev) =>
          prev.map((item) => (item.id === activeProduct.id ? normalizeProduct(updated) : item))
        );
      } else {
        const created = await api.products.create(payload);
        setProducts((prev) => [normalizeProduct(created), ...prev]);
      }
      setPanelOpen(false);
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.status === 401) return;
      setError(apiError.message || 'Kayıt sırasında hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`${product.name} ürününü silmek istiyor musunuz?`)) return;
    setSaving(true);
    setError(null);
    try {
      await api.products.remove(product.id);
      setProducts((prev) => prev.filter((item) => item.id !== product.id));
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.status === 401) return;
      setError(apiError.message || 'Silme işlemi başarısız oldu.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold">Ürün Yönetimi</h2>
            <p className="text-sm text-steel">
              Ürünlerinizi tek panelden yönetin, arayın ve hızlıca güncelleyin.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="btn btn-ghost" onClick={fetchProducts} disabled={loading}>
              Yenile
            </button>
            <button className="btn btn-primary" onClick={openCreate}>
              + Yeni Ürün
            </button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input
            className="input flex-1 min-w-[220px]"
            placeholder="Ürün ara..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
          <div className="badge">Toplam: {filtered.length}</div>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="space-y-4">
          {loading ? (
            <div className="card p-6 text-sm text-steel">Ürünler yükleniyor...</div>
          ) : pageItems.length === 0 ? (
            <div className="card p-6 text-sm text-steel">Gösterilecek ürün bulunamadı.</div>
          ) : (
            <div className="grid gap-4">
              {pageItems.map((product) => (
                <div key={product.id} className="card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-ink">{product.name}</h3>
                      <p className="mt-1 text-sm text-steel">{product.description || 'Açıklama yok.'}</p>
                      <p className="mt-3 text-sm font-semibold">
                        {currencyFormatter.format(product.price)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link className="btn btn-ghost" to={`/products/${product.id}`}>
                        Detay
                      </Link>
                      <button className="btn btn-ghost" onClick={() => openEdit(product)}>
                        Düzenle
                      </button>
                      <button className="btn btn-ghost" onClick={() => handleDelete(product)} disabled={saving}>
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-steel">
              Sayfa {safePage} / {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                className="btn btn-ghost"
                disabled={safePage === 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                Önceki
              </button>
              <button
                className="btn btn-ghost"
                disabled={safePage === totalPages}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              >
                Sonraki
              </button>
            </div>
          </div>
        </section>

        <section
          className={`card p-6 transition ${panelOpen ? 'opacity-100' : 'opacity-80'}`}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-steel">Form</p>
              <h3 className="text-lg font-semibold">{activeProduct ? 'Ürün Düzenle' : 'Yeni Ürün'}</h3>
            </div>
            {panelOpen && (
              <button className="btn btn-ghost" onClick={closePanel}>
                Kapat
              </button>
            )}
          </div>

          {panelOpen ? (
            <ProductForm
              initial={activeProduct}
              onSave={handleSave}
              onCancel={closePanel}
              loading={saving}
            />
          ) : (
            <div className="text-sm text-steel">
              Yeni ürün eklemek veya düzenlemek için kartları kullanın.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
