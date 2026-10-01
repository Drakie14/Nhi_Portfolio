// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// ĐỔI dòng `site` thành địa chỉ thật của bạn sau khi deploy
// (ví dụ https://nhi-portfolio.pages.dev hoặc tên miền riêng).
// Dùng cho sitemap, thẻ canonical và ảnh chia sẻ (Open Graph).
export default defineConfig({
  site: 'https://nhi-portfolio-cib.pages.dev',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  image: {
    // Các bề rộng ảnh dùng cho srcset (responsive)
    breakpoints: [480, 768, 1080, 1440, 1920],
  },
  build: {
    inlineStylesheets: 'always',
  },
});
