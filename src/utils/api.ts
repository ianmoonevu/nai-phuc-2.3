export async function apiJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    credentials: 'same-origin',
    cache: 'no-store',
    headers: {
      ...(init?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...init?.headers
    }
  });
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error('Máy chủ không trả về dữ liệu API. Vui lòng kiểm tra cấu hình Node.js trên hosting.');
  }
  const payload = await response.json();
  if (!response.ok || payload?.ok !== true) {
    throw new Error(response.status === 503
      ? 'Chưa kết nối được cơ sở dữ liệu. Nội dung chưa được lưu.'
      : response.status === 401
        ? 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.'
        : payload?.error || `Yêu cầu thất bại (${response.status}).`);
  }
  return payload as T;
}
