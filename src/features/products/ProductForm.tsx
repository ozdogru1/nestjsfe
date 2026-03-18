import { FormEvent, useMemo, useState } from 'react';
import { Product } from '../../types/product';

type Props = {
  initial?: Product | null;
  onSave: (payload: { name: string; description: string; price: number }) => void;
  onCancel: () => void;
  loading?: boolean;
};

export function ProductForm({ initial, onSave, onCancel, loading }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [price, setPrice] = useState(initial ? initial.price.toString() : '');

  const isEdit = Boolean(initial?.id);

  const parsedPrice = useMemo(() => {
    if (!price.trim()) return null;
    const value = Number(price);
    return Number.isNaN(value) ? null : value;
  }, [price]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (parsedPrice === null) return;
    onSave({
      name: name.trim(),
      description: description.trim(),
      price: parsedPrice,
    });
  };

  const showPriceError = price.trim().length > 0 && parsedPrice === null;

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="label" htmlFor="name">
          Ürün Adı
        </label>
        <input
          id="name"
          className="input"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          placeholder="Ürün adı"
        />
      </div>
      <div className="space-y-2">
        <label className="label" htmlFor="description">
          Açıklama
        </label>
        <textarea
          id="description"
          className="input min-h-[96px]"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Kısa açıklama"
        />
      </div>
      <div className="space-y-2">
        <label className="label" htmlFor="price">
          Fiyat
        </label>
        <input
          id="price"
          className="input"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          placeholder="1200"
          inputMode="decimal"
          type="number"
          min={0}
          step="0.01"
          required
        />
        {showPriceError && <p className="text-xs text-red-500">Geçerli bir sayı girin.</p>}
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          className="btn btn-primary"
          type="submit"
          disabled={loading || parsedPrice === null || !name.trim()}
        >
          {loading ? 'Kaydediliyor...' : isEdit ? 'Güncelle' : 'Kaydet'}
        </button>
        <button className="btn btn-ghost" type="button" onClick={onCancel}>
          Vazgeç
        </button>
      </div>
    </form>
  );
}
