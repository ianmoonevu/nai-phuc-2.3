// The cloud initially contains only edited projects, not the entire seed catalogue.
export function mergeProjects<T extends { id: string }>(defaults: T[], saved: T[], deletedIds: string[] = []): T[] {
  const deleted = new Set(deletedIds);
  const overrides = new Map(saved.map(item => [item.id, item]));
  const defaultIds = new Set(defaults.map(item => item.id));
  return [
    ...saved.filter(item => !defaultIds.has(item.id)),
    ...defaults.map(item => overrides.get(item.id) ?? item),
  ].filter(item => !deleted.has(item.id));
}
