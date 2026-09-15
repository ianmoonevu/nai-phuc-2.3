type Row = Record<string, any>;

// Legacy tables have required columns which a {id, data} fallback cannot satisfy.
export function legacyRequiredFields(table: string, item: Row): Row {
  if (table === 'projects') return {
    client: item.client || '', location: item.location || '', area: item.area || '',
    dosage: item.specifications?.dosage || '', fiber_type: item.specifications?.fiberSeries || '',
    year: item.year || '', image: item.image || '', sector: item.sector || 'industrial',
  };
  if (table === 'articles') return {
    publish_date: item.date || '', abstract: item.contentSnippet || '',
    slug: item.slug || item.id, image: item.image || '', read_time: item.readTime || '',
  };
  return {};
}

export async function writeDocument(client: any, table: string, row: Row, item: Row) {
  const payload = { ...row };
  const defaults = legacyRequiredFields(table, item);
  // Every retry removes a missing column or fills one known legacy requirement.
  const limit = Object.keys(payload).length + Object.keys(defaults).length + 1;
  for (let attempt = 0; attempt < limit; attempt++) {
    const { error } = await client.from(table).upsert(payload);
    if (!error) return;
    const missing = error.code === 'PGRST204'
      ? /Could not find the '([^']+)' column of '([^']+)'/.exec(error.message || '')
      : null;
    if (missing && missing[2] === table && !['id', 'data'].includes(missing[1]) && Object.hasOwn(payload, missing[1])) {
      delete payload[missing[1]];
      continue;
    }
    const required = error.code === '23502'
      ? /null value in column "([^"]+)"/.exec(error.message || '')?.[1]
      : null;
    if (required && Object.hasOwn(defaults, required) && payload[required] == null) {
      payload[required] = defaults[required];
      continue;
    }
    // Never bypass permissions, remove the complete document, or swallow validation errors.
    throw new Error(`${table}: ${error.message || 'Save failed'} (${error.code || 'unknown'})`);
  }
  throw new Error(`${table}: Could not reconcile database columns`);
}
