import { getSupabase } from './supabase';
import { AboutDocument, aboutPayload } from './aboutContent';

export async function loadAboutRow() {
  const db = getSupabase();
  if (!db) throw new Error('Chưa kết nối máy chủ lưu dữ liệu.');
  const { data, error } = await db.from('about_page_info').select('*').eq('id','default').maybeSingle();
  if (error) throw new Error(`Không tải được About Us: ${error.message}`);
  return data;
}
export function unpackAboutRow(row: any): Partial<AboutDocument> {
  if (!row) return {};
  const { leadershipHeads, advisoryMembers, ...info } = row.data || {};
  return { aboutInfo: { title: row.title, tagline: row.tagline, description: row.description, missionLabel: row.mission_label, missionQuote: row.mission_quote, missionAuthor: row.mission_author, leadershipHeading: row.leadership_heading, leadershipSubheading: row.leadership_subheading, advisoryHeading: row.advisory_heading, advisorySubheading: row.advisory_subheading, ...info }, leadershipHeads, advisoryMembers };
}
export const aboutRevision = (row: any): string | null => row ? row.updated_at : null;
export async function persistAbout(doc: AboutDocument, expected: string | null) {
  const payload = aboutPayload(doc), db = getSupabase();
  if (!db) throw new Error('Chưa kết nối máy chủ lưu dữ liệu.');
  const current = await loadAboutRow();
  if (aboutRevision(current) !== expected) throw new Error('About Us đã được sửa ở nơi khác. Hãy xuất bản nháp rồi tải lại nội dung trước khi lưu.');
  const row = { data: payload, updated_at: new Date().toISOString() };
  // Compare-and-swap prevents a stale tab from replacing another editor's changes.
  let result;
  if (current) {
    let query = db.from('about_page_info').update(row).eq('id','default');
    query = expected == null ? query.is('updated_at',null) : query.eq('updated_at',expected);
    result = await query.select('id');
  } else result = await db.from('about_page_info').insert({ id: 'default', ...row }).select('id');
  if (result.error) throw new Error(`Chưa lưu được About Us: ${result.error.message}`);
  if (!result.data?.length) throw new Error('About Us đã thay đổi hoặc máy chủ không cho phép lưu. Bản nháp vẫn được giữ.');
  const verified = await loadAboutRow();
  const stable = (value: any): any => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(k => [k,stable(value[k])])) : value;
  if (JSON.stringify(stable(verified?.data)) !== JSON.stringify(stable(payload))) throw new Error('Chưa xác nhận được nội dung đã lưu. Giữ bản nháp và tải lại để kiểm tra.');
  return verified;
}
