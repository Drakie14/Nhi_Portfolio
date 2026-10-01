import type { ImageMetadata } from 'astro';

// Mọi ảnh upload qua CMS nằm trong src/assets/uploads để Astro có thể
// nén, đổi kích thước và tạo srcset khi build.
const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/uploads/**/*.{jpg,jpeg,png,webp,avif,gif,JPG,JPEG,PNG,WEBP,AVIF,GIF}',
  { eager: true },
);

const byPath = new Map<string, ImageMetadata>();
const byName = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(files)) {
  byPath.set(path, mod.default);
  byName.set(path.split('/').pop()!.toLowerCase(), mod.default);
}

/** Tìm ảnh theo đường dẫn mà CMS ghi vào nội dung. */
export function resolveImage(src?: string): ImageMetadata | undefined {
  if (!src) return undefined;
  let p = src.trim();
  try {
    p = decodeURI(p);
  } catch {
    /* giữ nguyên */
  }
  p = p.replace(/^\.\//, '');
  if (!p.startsWith('/')) p = '/' + p;
  return byPath.get(p) ?? byName.get(p.split('/').pop()!.toLowerCase());
}

const RATIOS = ['4/5', '3/4', '1/1', '4/3', '2/3', '3/2'];

/** Tỉ lệ khung placeholder ổn định theo từng mục (để lưới không đều tăm tắp). */
export function placeholderRatio(key: string): string {
  let h = 0;
  for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return RATIOS[h % RATIOS.length];
}

export function ratioOf(img: ImageMetadata | undefined, key: string): string {
  return img ? `${img.width}/${img.height}` : placeholderRatio(key);
}
