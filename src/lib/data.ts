import { getCollection, type CollectionEntry } from 'astro:content';

export type Work = CollectionEntry<'works'>;
export type Project = CollectionEntry<'projects'>;
export type Milestone = CollectionEntry<'journey'>;

export const SEMESTERS = [
  'Trước nhập học',
  'HK1 – Năm 1',
  'HK2 – Năm 1',
  'HK1 – Năm 2',
  'HK2 – Năm 2',
  'HK1 – Năm 3',
  'HK2 – Năm 3',
  'HK1 – Năm 4',
  'HK2 – Năm 4',
  'HK1 – Năm 5',
  'HK2 – Năm 5',
  'Sau tốt nghiệp',
];

export async function getSettings() {
  const all = await getCollection('settings');
  const entry = all[0];
  if (!entry) throw new Error('Thiếu file src/content/settings/thong-tin.md');
  return entry;
}

/** Tác phẩm: theo "thứ tự hiển thị" tăng dần, cùng thứ tự thì mới nhất trước. */
export async function getWorks(): Promise<Work[]> {
  const list = await getCollection('works');
  return list.sort(
    (a, b) => a.data.order - b.data.order || b.data.date.getTime() - a.data.date.getTime(),
  );
}

export async function getProjects(): Promise<Project[]> {
  const list = await getCollection('projects');
  return list.sort(
    (a, b) =>
      a.data.order - b.data.order ||
      (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0),
  );
}

/** Hành trình: mới nhất ở trên. */
export async function getJourney(): Promise<Milestone[]> {
  const list = await getCollection('journey');
  return list.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const fig = (n: number) => `FIG. ${String(n).padStart(2, '0')}`;

export function formatDate(d: Date) {
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  return `${dd}.${mm}.${d.getUTCFullYear()}`;
}

/** Số học kỳ đã trải qua tại trường (không tính "Trước nhập học"). */
export function countSemesters(values: (string | undefined)[]) {
  const set = new Set(
    values.filter((v): v is string => !!v && v !== 'Trước nhập học' && v !== 'Sau tốt nghiệp'),
  );
  return set.size;
}
