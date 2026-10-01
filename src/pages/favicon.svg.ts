import type { APIRoute } from 'astro';
import { getSettings } from '../lib/data';

// Favicon: chữ cái đầu tên trong khung vuông như con dấu kiến trúc
export const GET: APIRoute = async () => {
  const { name } = (await getSettings()).data;
  const initial = (name.trim().split(/\s+/).pop() ?? 'A').charAt(0).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#0d0d0f"/>
  <rect x="4.5" y="4.5" width="55" height="55" fill="none" stroke="#ece8e1" stroke-width="3"/>
  <rect x="11" y="11" width="42" height="42" fill="none" stroke="#c0643f" stroke-width="2"/>
  <text x="32" y="44" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="32" font-weight="700" fill="#ece8e1">${initial}</text>
</svg>`;
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
};
