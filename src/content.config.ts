import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// CMS đôi khi ghi trường trống thành "" hoặc null — coi chúng như "không có".
const empty = (v: unknown) => (v === '' || v === null ? undefined : v);
const optStr = () => z.preprocess(empty, z.string().optional());
const optDate = () => z.preprocess(empty, z.coerce.date().optional());
const optList = <T extends z.ZodTypeAny>(item: T) =>
  z.preprocess((v) => (v === '' || v === null ? [] : v), z.array(item).default([]));

// Đường dẫn ảnh dạng chuỗi (ví dụ "/src/assets/uploads/ten-anh.webp").
// Ảnh được tìm và tối ưu bởi src/lib/images.ts.
const imagePath = optStr;

const captionedImage = z.object({
  image: imagePath(),
  caption: optStr(),
});

export const CATEGORIES = [
  'Ký hoạ',
  'Màu nước',
  'Chì & Mực',
  'Bản vẽ kỹ thuật',
  'Mô hình',
  'Kỹ thuật số',
  'Khác',
] as const;

const works = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/works' }),
  schema: z.object({
    title: z.string(),
    image: imagePath(),
    gallery: optList(z.string()),
    date: z.coerce.date(),
    category: z.preprocess(empty, z.enum(CATEGORIES).default('Khác')),
    medium: optStr(),
    size: optStr(),
    semester: optStr(),
    description: optStr(),
    featured: z.preprocess(empty, z.boolean().default(false)),
    order: z.preprocess(empty, z.coerce.number().default(100)),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    subject: optStr(),
    semester: optStr(),
    date: optDate(),
    cover: imagePath(),
    summary: optStr(),
    featured: z.preprocess(empty, z.boolean().default(false)),
    order: z.preprocess(empty, z.coerce.number().default(100)),
    brief: optStr(),
    concept: optStr(),
    process: optList(captionedImage),
    results: optList(captionedImage),
    learned: optStr(),
    teacher: z
      .preprocess(
        empty,
        z
          .object({
            show: z.preprocess(empty, z.boolean().default(false)),
            score: optStr(),
            comment: optStr(),
          })
          .optional(),
      ),
  }),
});

const journey = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journey' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    semester: optStr(),
    image: imagePath(),
    relatedWorks: optList(z.string()),
    relatedProjects: optList(z.string()),
  }),
});

const settings = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/settings' }),
  schema: z.object({
    name: z.string(),
    nickname: optStr(),
    tagline: optStr(),
    avatar: imagePath(),
    school: optStr(),
    schoolYear: optStr(),
    skills: optList(z.string()),
    facebook: optStr(),
    instagram: optStr(),
    email: optStr(),
    tiktok: optStr(),
  }),
});

export const collections = { works, projects, journey, settings };
