import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { FiberProduct } from '../types';
import { validateProduct } from '../lib/contentBackup';
import { ImagePickerModal } from './ImagePickerModal';
const fields = { name: 'Tên sản phẩm', series: 'Dòng sản phẩm', subtitle: 'Tiêu đề phụ', description: 'Mô tả', tensileStrength: 'Cường độ kéo (kèm đơn vị)', aspectRatio: 'Tỷ lệ L/D', primaryApplication: 'Ứng dụng chính', fiberCountPerKg: 'Số sợi/kg', geometry: 'Hình dạng', diameter: 'Đường kính', length: 'Chiều dài', coating: 'Lớp phủ', image: 'Đường dẫn ảnh' } as const;
const lists = { tensileClasses: 'Các cấp cường độ', standardCodes: 'Mã tiêu chuẩn', codes: 'Mã khác', applications: 'Các ứng dụng', standards: 'Tiêu chuẩn' } as const;
export function AdminProductsSection() {
  const { products, productsReady, productError, saveProducts } = useContent();
  const [draft, setDraft] = useState<FiberProduct | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [picker, setPicker] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); if (!draft) return; setBusy(true); setMessage('');
    try {
      validateProduct(draft);
      await saveProducts(products.some(p => p.id === draft.id) ? products.map(p => p.id === draft.id ? draft : p) : [...products, draft]);
      setDraft(null); setMessage('Đã lưu và kiểm tra trên Supabase. Trang chủ và Products dùng cùng dữ liệu này.');
    } catch (e) { setMessage((e as Error).message); } finally { setBusy(false); }
  };
  return <section className="bg-white rounded-3xl p-6 space-y-5 border border-slate-200">
    <h2 className="text-2xl font-bold">Products — Quản lý sản phẩm</h2>
    <p>Ảnh và thông số dùng chung cho trang chủ và trang Products. Giữ nguyên đơn vị anh nhập.</p>
    {!productsReady && <p role="alert">{productError || 'Đang tải sản phẩm…'}</p>}
    {message && <p role="status" className="p-3 bg-slate-100 rounded-xl">{message}</p>}
    {!draft && <><button disabled={!productsReady} className="bg-[#00356a] text-white rounded-xl px-4 py-2 disabled:opacity-50" onClick={() => setDraft({ ...structuredClone(products[0]), id: `product-${crypto.randomUUID()}`, name: 'Sản phẩm mới', image: '' })}>Thêm sản phẩm</button>
      <div className="grid md:grid-cols-3 gap-4">{products.map(p => <article key={p.id} className="border rounded-2xl p-4 space-y-3">{p.image && <img src={p.image} alt={p.name} className="h-32 w-full object-contain" />}<h3 className="font-bold">{p.name}</h3><p>{p.tensileStrength} · {p.length}</p><button disabled={!productsReady} className="underline" onClick={() => { setDraft(structuredClone(p)); setMessage(''); }}>Chỉnh sửa {p.name}</button></article>)}</div></>}
    {draft && <form onSubmit={submit} className="space-y-4"><fieldset disabled={busy} className="grid md:grid-cols-2 gap-4 disabled:opacity-60">
      {Object.entries(fields).map(([key, label]) => <label key={key} className="block text-sm font-medium">{label}<textarea rows={key === 'description' ? 4 : 2} required={key === 'name'} className="block border rounded-lg p-2 w-full mt-1" value={String(draft[key as keyof FiberProduct] || '')} onChange={e => setDraft({ ...draft, [key]: e.target.value })} /></label>)}
      <div>{draft.image && <img src={draft.image} alt="Ảnh sản phẩm đang chỉnh" className="h-40 object-contain" />}<button type="button" className="underline" onClick={() => setPicker(true)}>Chọn / tải ảnh</button></div>
      {Object.entries(lists).map(([key, label]) => <label key={key} className="text-sm font-medium">{label} (mỗi dòng một mục)<textarea className="block border rounded-lg p-2 w-full mt-1" rows={3} value={(draft[key as keyof typeof lists] || []).join('\n')} onChange={e => setDraft({ ...draft, [key]: e.target.value.split('\n') })} /></label>)}
      {(['keyMetric1', 'keyMetric2'] as const).map((key, i) => <div key={key}><label className="block">Nhãn chỉ số {i + 1}<input className="border rounded p-2 w-full" value={draft[key].label} onChange={e => setDraft({ ...draft, [key]: { ...draft[key], label: e.target.value } })} /></label><label className="block">Giá trị chỉ số {i + 1}<input className="border rounded p-2 w-full" value={draft[key].value} onChange={e => setDraft({ ...draft, [key]: { ...draft[key], value: e.target.value } })} /></label></div>)}
    </fieldset><button disabled={busy || !productsReady} type="submit" className="bg-[#006e21] text-white px-5 py-3 rounded-xl disabled:opacity-50">{busy ? 'Đang lưu…' : 'Lưu sản phẩm'}</button><button type="button" disabled={busy} className="ml-4 underline" onClick={() => setDraft(null)}>Hủy</button></form>}
    {picker && draft && <ImagePickerModal isOpen onClose={() => setPicker(false)} currentSelectedUrl={draft.image} onSelectImage={image => { setDraft({ ...draft, image }); setPicker(false); }} />}
  </section>;
}
