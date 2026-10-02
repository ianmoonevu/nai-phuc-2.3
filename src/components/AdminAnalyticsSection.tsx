import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { fetchBrandingFromSupabase, saveBrandingToSupabase } from '../lib/supabaseSync';
import { normalizeGa4Id } from '../lib/analytics';

export function AdminAnalyticsSection() {
  const { branding, isAdminAuthenticated } = useData();
  const [id, setId] = useState(branding.ga4MeasurementId || '');
  const [enabled, setEnabled] = useState(branding.ga4Enabled === true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function save() {
    if (busy || !isAdminAuthenticated) return;
    const clean = normalizeGa4Id(id);
    if ((id.trim() && !clean) || (enabled && !clean)) {
      setMessage('Nhập Measurement ID dạng G-XXXXXXXXXX. Không dán đoạn script hoặc mã GTM.'); return;
    }
    setBusy(true); setMessage('');
    try {
      const current = await fetchBrandingFromSupabase();
      if (!current) throw new Error('Chưa đọc được cấu hình website. Vui lòng thử lại.');
      const next = { ...current, ga4MeasurementId: clean, ga4Enabled: enabled };
      if (!await saveBrandingToSupabase(next)) throw new Error('Chưa lưu được cấu hình. Vui lòng thử lại.');
      const saved = await fetchBrandingFromSupabase();
      if (saved?.ga4MeasurementId !== clean || saved?.ga4Enabled !== enabled) throw new Error('Chưa xác nhận được dữ liệu đã lưu. Vui lòng thử lại.');
      try { localStorage.setItem('hoki_branding_v1', JSON.stringify(saved)); } catch { /* Reload reads the saved configuration. */ }
      window.location.reload();
    } catch (e) { setMessage((e as Error).message); setBusy(false); }
  }
  if (document.getElementById('hoki-gtm')) return <section className="bg-white rounded-2xl p-6 space-y-5 border border-slate-200">
    <h2 className="text-xl font-bold">Google Tag Manager</h2>
    <p>Website đã cài container <strong>GTM-5TCPTXZ2</strong>.</p>
    <p>Quản lý GA4 trong Google Tag Manager. GA4 trực tiếp trên website được bỏ qua để tránh đếm trùng; mã đã lưu vẫn được giữ trong backup.</p>
    <p>Trong GTM, tạo Google tag với mã G-… của anh, chọn trigger phù hợp rồi Preview và Submit / Publish.</p>
    <p>Đo chuyển trang React: dùng Page changes based on browser history events của GA4 hoặc thiết lập History Change trong GTM, chỉ chọn một cách.</p>
    <p>Việc loại trừ trang và phiên Admin cần cấu hình trong GTM. Nút bật/tắt GA4 trực tiếp trước đây không điều khiển container GTM.</p>
    <a className="text-blue-700 underline" href="https://tagmanager.google.com/" target="_blank" rel="noopener noreferrer">Mở Google Tag Manager</a>
  </section>;
  return <section className="bg-white rounded-2xl p-6 space-y-5 border border-slate-200">
    <h2 className="text-xl font-bold">Google Analytics 4</h2>
    <p>Nhập mã GA4 để đo lượt xem các trang công khai. Cấu hình được lưu trong System Backup cùng Branding.</p>
    <label className="block">Measurement ID
      <input className="block border rounded-lg p-3 mt-2 w-full max-w-md" placeholder="G-XXXXXXXXXX" value={id} onChange={e => setId(e.target.value)} disabled={busy} />
    </label>
    <label className="flex gap-3 items-center"><input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} disabled={busy} />Bật đo lường GA4</label>
    <p className="text-sm">Để trống và tắt nếu chưa có mã. Khi đổi sang hokimetal.com có thể giữ mã này; cập nhật Website URL trong luồng dữ liệu GA4.</p>
    <div className="bg-amber-50 p-4 rounded-lg text-sm">Trước khi bật: trong GA4 → Data streams → luồng Web → Enhanced measurement → Page views → Advanced settings, tắt “Page changes based on browser history events”. Website tự gửi lượt xem khi chuyển trang. Không cài thêm cùng mã GA4 qua GTM.</div>
    <p className="text-sm">Sau khi lưu, trang tải lại. Mở website bằng cửa sổ riêng để kiểm tra trong GA4 Realtime. Phiên đang đăng nhập Admin không được đo.</p>
    <button onClick={save} disabled={busy} className="bg-[#00356a] text-white px-5 py-3 rounded-lg disabled:opacity-50">{busy ? 'Đang lưu…' : 'Lưu GA4'}</button>
    <p role="status">{message}</p>
  </section>;
}
