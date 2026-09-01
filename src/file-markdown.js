export function sanitizeFileName(value) {
  const text = String(value ?? '').trim() || 'File';
  const normalized = text
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '_')
    .replace(/\s+/g, ' ')
    .trim();

  return normalized || 'File';
}

export function serializeFileLink({ name, href, size = '' }) {
  const safeName = sanitizeFileName(name);
  const safeHref = String(href || '').trim();
  const safeSize = String(size || '').replace(/[\r\n"]/g, '').trim();

  return safeHref
    ? `[${safeName}](${safeHref}${safeSize ? ` "${safeSize}"` : ''})`
    : `[${safeName}]()`;
}
