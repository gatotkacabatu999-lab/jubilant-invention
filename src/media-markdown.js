function findClosingBracket(source, start) {
  for (let index = start; index < source.length; index += 1) {
    if (source[index] === '\\') {
      index += 1;
      continue;
    }
    if (source[index] === ']') return index;
  }
  return -1;
}

function findClosingParenthesis(source, start) {
  let depth = 1;
  let quote = '';

  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    if (char === '\\') {
      index += 1;
      continue;
    }

    if (quote) {
      if (char === quote) quote = '';
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === '(') depth += 1;
    if (char === ')') {
      depth -= 1;
      if (depth === 0) return index;
    }
  }

  return -1;
}

function parseDestination(value) {
  const trimmed = value.trim();
  if (!trimmed) return { src: '', title: '' };

  if (trimmed.startsWith('<')) {
    const end = trimmed.indexOf('>');
    if (end !== -1) {
      return {
        src: trimmed.slice(1, end),
        title: trimmed.slice(end + 1).trim().replace(/^["']|["']$/g, '')
      };
    }
  }

  const titled = trimmed.match(/^(.+?)(?:\s+(?:"((?:\\.|[^"])*)"|'((?:\\.|[^'])*)'))$/);
  if (titled) {
    return {
      src: titled[1],
      title: titled[2] ?? titled[3] ?? ''
    };
  }

  return { src: trimmed, title: '' };
}

export function parseMarkdownImages(text) {
  const source = String(text || '');
  const images = [];

  for (let start = 0; start < source.length - 3; start += 1) {
    if (source[start] !== '!' || source[start + 1] !== '[') continue;

    const captionEnd = findClosingBracket(source, start + 2);
    if (captionEnd === -1 || source[captionEnd + 1] !== '(') continue;

    const destinationEnd = findClosingParenthesis(source, captionEnd + 2);
    if (destinationEnd === -1) continue;

    const destination = parseDestination(source.slice(captionEnd + 2, destinationEnd));
    if (!destination.src) continue;

    images.push({
      start,
      end: destinationEnd + 1,
      syntax: 'markdown',
      caption: source.slice(start + 2, captionEnd),
      src: destination.src,
      title: destination.title
    });
    start = destinationEnd;
  }

  return images;
}

function escapeHtmlAttribute(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function markdownImagesToGalleryMarkup(text) {
  const images = parseMarkdownImages(String(text || ''));
  if (!images.length) return '';

  const overflowCount = Math.max(images.length - 3, 0);
  const hasOverflow = overflowCount > 0;
  const galleryClass = images.length > 1 ? 'media-gallery media-gallery-grid-3' : 'media-gallery';

  return `<div class="${galleryClass}" data-overflow-count="${overflowCount}">${images.map((image, index) => {
    const caption = image.caption || image.title || 'Image';
    const src = escapeHtmlAttribute(image.src);
    const label = escapeHtmlAttribute(caption);
    const isOverflowItem = hasOverflow && index === 2;
    const extraClass = isOverflowItem ? ' media-item-overflow' : '';
    const overlay = isOverflowItem ? `<span class="media-item-more">+${overflowCount} more</span>` : '';
    const hiddenClass = hasOverflow && index >= 3 ? ' media-item-hidden' : '';

    return `<a href="${src}" class="media-item${extraClass}${hiddenClass}" data-media-type="image"><img src="${src}" alt="${label}" />${overlay}</a>`;
  }).join('')}</div>`;
}

export function serializeMarkdownImage({ caption, src, title = '' }) {
  const safeCaption = String(caption || '').replace(/[\r\n\[\]]/g, '').trim() || 'Imej';
  const safeTitle = String(title || '').replace(/[\r\n"]/g, '').trim();
  return `![${safeCaption}](${src}${safeTitle ? ` "${safeTitle}"` : ''})`;
}