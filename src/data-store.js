export const DEFAULT_BOOK_TITLE = 'RecipeBook';

export function normalizeBookTitle(value) {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  return trimmed || DEFAULT_BOOK_TITLE;
}

export function seedData() {
  return [
    {
      id: uid(),
      title: 'Pengenalan',
      children: [],
      content: `# Selamat Datang 👋

Ini adalah **DocBook**, sistem dokumentasi moden bergaya GitBook.

- Klik **Edit Mode** di penjuru atas untuk mula menyunting
- Guna butang **+** pada sidebar untuk tambah menu / submenu
- Tulis kandungan dalam format **Markdown**

> Semua perubahan disimpan automatik pada pelayar anda (localStorage).`
    },
    {
      id: uid(),
      title: 'Panduan Bermula',
      children: [
        {
          id: uid(),
          title: 'Pasang',
          children: [],
          content: `## Pasang DocBook\n\nTiada pemasangan diperlukan — cuma buka \`index.html\` dalam pelayar.`
        },
        {
          id: uid(),
          title: 'Konfigurasi',
          children: [],
          content: `## Konfigurasi\n\nUbah suai struktur menu terus dari sidebar semasa **Edit Mode** aktif.`
        }
      ],
      content: `# Panduan Bermula\n\nBahagian ini mengandungi submenu untuk membantu anda bermula.`
    },
    {
      id: uid(),
      title: 'Rujukan API',
      children: [],
      content: `# Rujukan API\n\n\`\`\`js\nfunction hello() {\n  console.log("Hello DocBook!");\n}\n\`\`\``
    }
  ];
}

export function uid() {
  return 'p_' + Math.random().toString(36).slice(2, 10);
}

export function normalizeDocumentState(raw = {}) {
  const pages = Array.isArray(raw.pages) && raw.pages.length > 0 ? raw.pages : seedData();
  const activeId = raw.activeId || pages[0]?.id || null;
  const bookTitle = normalizeBookTitle(raw.bookTitle);

  return {
    pages,
    activeId,
    bookTitle
  };
}

export function hasUnsavedChanges(currentValue, originalValue) {
  if (originalValue == null) {
    return currentValue != null;
  }

  const nextValue = currentValue == null ? '' : String(currentValue);
  const previousValue = String(originalValue);
  return nextValue !== previousValue;
}
