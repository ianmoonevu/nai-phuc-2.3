import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { validateBackup } from '../lib/contentBackup';
export function AdminBackupModal({ isOpen, onClose, onShowToast }: { isOpen: boolean; onClose: () => void; onShowToast: (message: string) => void; defaultSubTab?: 'download' | 'restore' }) {
  const { exportBackupData, importBackupData, productsReady } = useContent();
  const [incoming, setIncoming] = useState<any>(null);
  const [summary, setSummary] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  if (!isOpen) return null;
  const download = (type: 'all' | 'projects' | 'knowledge') => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(exportBackupData(type), null, 2)], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = `hoki-${type}-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000); onShowToast('Đã tải file backup.');
  };
  const restore = async () => {
    if (!incoming) return;
    setBusy(true); const result = await importBackupData(incoming); setBusy(false); setMessage(result.message);
    if (result.success) onShowToast(result.message);
  };
  return <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
    <section role="dialog" aria-modal="true" aria-labelledby="backup-title" className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-auto space-y-5">
      <div className="flex justify-between"><h2 id="backup-title" className="font-bold text-2xl">System Backup & Restore</h2><button disabled={busy} onClick={onClose} aria-label="Đóng backup">✕</button></div>
      <p>Full backup chứa Projects, Knowledge, Products, hotline, mạng xã hội, logo/favicon, video, About Us, nhân sự, đối tác, media và yêu cầu tư vấn đang có trong admin.</p>
      <p className="text-sm">Ảnh nhúng được giữ trong JSON; ảnh lưu bằng URL vẫn là đường dẫn, không phải bản sao tệp ảnh. File có thể chứa thông tin khách hàng — hãy giữ riêng. Không chứa mật khẩu hay khóa kết nối.</p>
      {!productsReady && <p role="alert">Sản phẩm chưa tải xong từ máy chủ. Backup lúc này chứa bản sản phẩm hiện có trên trình duyệt.</p>}
      <div className="flex gap-3 flex-wrap">{(['all', 'projects', 'knowledge'] as const).map(type => <button disabled={busy} className="px-4 py-3 rounded-xl bg-[#00356a] text-white" key={type} onClick={() => download(type)}>{type === 'all' ? 'Full Backup (All Content)' : `Backup ${type}`}</button>)}</div>
      <hr /><h3 className="font-bold">Khôi phục / gộp nội dung</h3>
      <p className="text-sm">Các mục trùng ID được cập nhật từ file. Giữ các mục khác và những phần không có trong backup cũ. Một bản sao trước khôi phục sẽ được tải xuống trước khi ghi dữ liệu.</p>
      <label className="block">Chọn file backup JSON<input disabled={busy} type="file" accept="application/json,.json" className="block mt-2" onChange={async e => {
        setIncoming(null); setMessage(''); setSummary(''); const file = e.target.files?.[0]; if (!file) return;
        try { const raw = JSON.parse(await file.text()); const content = validateBackup(raw); setIncoming(raw); setSummary(Object.entries(content).map(([k,v]) => `${k}: ${Array.isArray(v) ? v.length : 'có'}`).join(' · ')); }
        catch (error) { setMessage((error as Error).message); }
      }} /></label>
      {summary && <p className="text-sm bg-slate-100 p-3 rounded-lg">{summary}</p>}
      <button disabled={busy || !incoming} onClick={restore} className="px-4 py-3 rounded-xl bg-[#006e21] text-white disabled:opacity-40">{busy ? 'Đang khôi phục…' : 'Khôi phục và gộp dữ liệu'}</button>
      {message && <p role="status">{message}</p>}
    </section>
  </div>;
}
