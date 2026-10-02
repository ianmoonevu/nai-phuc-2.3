// The entered ID is translated to an Auth identifier; no credential is bundled.
export function adminEmail(id: string): string {
  const normalized = id.trim().toLowerCase();
  if (!/^[a-z0-9][a-z0-9._-]{0,63}$/.test(normalized)) throw new Error('Invalid admin ID.');
  return `${normalized}@admin.hokimetal.vn`;
}
export async function verifyAdmin(client: any): Promise<boolean> {
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) return false;
  const role = await client.rpc('is_site_admin');
  return !role.error && role.data === true;
}
export async function authenticateAdmin(client: any, id: string, password: string): Promise<boolean> {
  const { error } = await client.auth.signInWithPassword({ email: adminEmail(id), password });
  if (error) return false;
  if (await verifyAdmin(client)) return true;
  await client.auth.signOut({scope:'local'});
  return false;
}
