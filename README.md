# Portfolio Kiến trúc — Astro + Sveltia CMS + Cloudflare Pages

Website portfolio cá nhân để trưng bày tranh, ký hoạ, bản vẽ, mô hình, đồ án và nhật ký học tập ở UAH.
**Chi phí: 0đ.** Code nằm trên GitHub (repo public), website chạy trên Cloudflare Pages, bạn tự thêm/sửa nội dung bằng giao diện “✎ Chế độ kiến trúc sư” (`/admin`) mà không cần đụng vào code.

```
Bạn sửa ở /admin  ──►  CMS commit lên GitHub  ──►  Cloudflare Pages tự build lại (~1–2 phút)  ──►  Web cập nhật
```

---

## Mục lục

0. [Chuẩn bị](#0-chuẩn-bị)
1. [Tạo repo public trên GitHub và đẩy code lên](#1-tạo-repo-public-trên-github-và-đẩy-code-lên)
2. [Kết nối repo với Cloudflare Pages](#2-kết-nối-repo-với-cloudflare-pages)
3. [Bật đăng nhập cho /admin (OAuth App + Worker)](#3-bật-đăng-nhập-cho-admin)
4. [Vào /admin và thêm tác phẩm đầu tiên](#4-vào-admin-và-thêm-tác-phẩm-đầu-tiên)
5. [Đổi link mạng xã hội, gắn tên miền riêng](#5-đổi-link-mạng-xã-hội-và-gắn-tên-miền-riêng-tuỳ-chọn)
6. [Lưu ý về dung lượng ảnh](#6-lưu-ý-về-dung-lượng-ảnh)
7. [Chạy thử trên máy & cấu trúc thư mục](#7-chạy-thử-trên-máy--cấu-trúc-thư-mục)

---

## 0. Chuẩn bị

| Cần có | Ghi chú |
| --- | --- |
| Tài khoản **GitHub** | Miễn phí — <https://github.com/signup> |
| Tài khoản **Cloudflare** | Miễn phí — <https://dash.cloudflare.com/sign-up> |
| **Node.js 22** trở lên | Chỉ cần nếu muốn chạy thử trên máy — <https://nodejs.org> |
| **Git** | <https://git-scm.com> (hoặc dùng GitHub Desktop) |

> 🔒 Repo là **public**: ai cũng đọc được code. Website này **không chứa bất kỳ mật khẩu/token nào**. Client secret chỉ nằm trong biến môi trường của Cloudflare Worker (bước 3). Đừng bao giờ dán token vào file trong repo.

---

## 1. Tạo repo public trên GitHub và đẩy code lên

1. Vào <https://github.com/new>.
2. **Repository name**: ví dụ `portfolio`. Chọn **Public**. *Không* tick “Add a README” (vì đã có sẵn).
3. Bấm **Create repository**.
4. Mở Terminal tại thư mục dự án này và chạy (thay `TEN-GITHUB` bằng tên tài khoản của bạn):

   ```bash
   git init
   git add .
   git commit -m "Khởi tạo portfolio"
   git branch -M main
   git remote add origin https://github.com/TEN-GITHUB/portfolio.git
   git push -u origin main
   ```

   Nếu Git hỏi mật khẩu: GitHub không nhận mật khẩu tài khoản nữa. Hãy đăng nhập bằng trình duyệt khi được hỏi, hoặc dùng **GitHub Desktop** cho đơn giản.

5. Mở file **`public/admin/config.yml`** và sửa dòng `repo:` thành `TEN-GITHUB/portfolio`. Commit & push lại.

---

## 2. Kết nối repo với Cloudflare Pages

1. Vào <https://dash.cloudflare.com> → **Workers & Pages** → **Create** → tab **Pages** → **Connect to Git**.
2. Cho phép Cloudflare truy cập GitHub, chọn repo `portfolio` → **Begin setup**.
3. Điền như sau:

   | Mục | Giá trị |
   | --- | --- |
   | Project name | `portfolio` (sẽ thành `portfolio.pages.dev`) |
   | Production branch | `main` |
   | Framework preset | `Astro` |
   | Build command | `npm run build` |
   | Build output directory | `dist` |

4. Mở **Environment variables (advanced)** → thêm biến:

   | Variable name | Value |
   | --- | --- |
   | `NODE_VERSION` | `22` |

   (File `.nvmrc` trong repo cũng đã ghi `22`.)

5. Bấm **Save and Deploy**. Chờ 1–2 phút, bạn sẽ có địa chỉ dạng `https://portfolio.pages.dev`.
6. Quay lại sửa địa chỉ thật vào 2 chỗ rồi commit & push:
   - `astro.config.mjs` → dòng `site: 'https://...'` (dùng cho sitemap và ảnh chia sẻ Facebook/Zalo).
   - `public/admin/config.yml` → dòng `site_url:` và `display_url:`.

---

## 3. Bật đăng nhập cho /admin

CMS cần đăng nhập GitHub để được phép commit vào repo. Vì website là trang tĩnh, ta dùng một **Cloudflare Worker miễn phí** tên là **sveltia-cms-auth** làm “người gác cổng” OAuth.

### 3a. Deploy Worker

1. Mở <https://github.com/sveltia/sveltia-cms-auth> và bấm nút **Deploy to Cloudflare Workers** trong README.
   Làm theo hướng dẫn: đăng nhập Cloudflare, cho phép tạo repo bản sao, bấm Deploy.
2. Xong, vào **Workers & Pages** → mở Worker `sveltia-cms-auth` → copy địa chỉ dạng:

   ```
   https://sveltia-cms-auth.<ten-cua-ban>.workers.dev
   ```

### 3b. Tạo GitHub OAuth App

1. Vào <https://github.com/settings/applications/new> (Settings → Developer settings → OAuth Apps → New OAuth App).
2. Điền:

   | Mục | Giá trị |
   | --- | --- |
   | Application name | `Portfolio CMS` (tuỳ ý) |
   | Homepage URL | `https://portfolio.pages.dev` (web của bạn) |
   | Authorization callback URL | `https://sveltia-cms-auth.<ten-cua-ban>.workers.dev/callback` ← **URL Worker + `/callback`** |

3. **Register application** → copy **Client ID** → bấm **Generate a new client secret** → copy **Client secret** (chỉ hiện một lần).

### 3c. Đặt biến môi trường cho Worker (nơi DUY NHẤT chứa secret)

Vào Worker `sveltia-cms-auth` → **Settings** → **Variables and Secrets** → **Add**:

| Tên biến | Giá trị | Kiểu |
| --- | --- | --- |
| `GITHUB_CLIENT_ID` | Client ID vừa copy | Text |
| `GITHUB_CLIENT_SECRET` | Client secret vừa copy | **Secret** (mã hoá) |
| `ALLOWED_DOMAINS` | `portfolio.pages.dev` (thêm tên miền riêng nếu có, cách nhau dấu phẩy) | Text |

Bấm **Deploy** để lưu.

### 3d. Điền URL Worker vào CMS

Mở `public/admin/config.yml`, sửa dòng:

```yaml
base_url: https://sveltia-cms-auth.<ten-cua-ban>.workers.dev
```

Commit & push. Chờ Cloudflare Pages build xong.

### Phương án dự phòng: đăng nhập bằng Personal Access Token

Nếu chưa làm kịp bước 3a–3c, bạn vẫn vào được CMS bằng token:

1. Vào <https://github.com/settings/personal-access-tokens/new> (**Fine-grained token**).
2. **Repository access** → *Only select repositories* → chọn `portfolio`.
3. **Permissions** → *Repository permissions* → **Contents: Read and write**.
4. Tạo token, copy.
5. Ở `/admin` bấm **Sign In Using Access Token** và dán token vào.

> Token chỉ được lưu trong trình duyệt của bạn. **Không** dán token vào bất kỳ file nào trong repo. Đặt hạn dùng (expiration) cho token và tạo lại khi hết hạn.

---

## 4. Vào /admin và thêm tác phẩm đầu tiên

1. Mở `https://portfolio.pages.dev/admin/`, hoặc bấm nút nhỏ **✎ Chế độ kiến trúc sư** ở cuối trang.
2. Bấm **Sign In with GitHub** → cho phép ứng dụng.
   (Giao diện CMS tự hiển thị tiếng Việt nếu trình duyệt của bạn đặt ngôn ngữ tiếng Việt.)
3. Bên trái có 4 mục:
   - **Tác phẩm**: tranh, ký hoạ, bản vẽ, mô hình.
   - **Đồ án**: dự án nhiều bước, có trang riêng kiểu tạp chí.
   - **Hành trình học tập**: các mốc theo học kỳ.
   - **Giới thiệu bản thân**: tên, ảnh đại diện, giới thiệu, mạng xã hội.
4. Vào **Tác phẩm** → **New** → điền tiêu đề, kéo ảnh vào **Ảnh chính**, chọn danh mục, học kỳ… → **Save**.
5. CMS tạo một commit trên GitHub. Sau khoảng 1–2 phút, tải lại trang web để thấy tác phẩm mới.
   Theo dõi tiến trình build ở Cloudflare → Workers & Pages → `portfolio` → **Deployments**.

**Mẹo:**
- Bật **Nổi bật** cho 3–6 mục để đưa lên dải cuộn ngang ở đầu trang.
- **Thứ tự hiển thị**: số nhỏ hiện trước.
- Mục nào chưa có ảnh sẽ hiện khung “Tác phẩm sắp ra mắt”.
- Website có sẵn vài **mục mẫu**. Bạn có thể sửa thành nội dung thật, hoặc mở mục đó và chọn **Delete**.
- Ảnh JPG/PNG upload qua CMS được **tự chuyển sang WebP** (tối đa 2400px). Khi build, website tự tạo nhiều kích thước (srcset) và lazy-load.

---

## 5. Đổi link mạng xã hội và gắn tên miền riêng (tuỳ chọn)

### Đổi link mạng xã hội, email, tên, ảnh đại diện

`/admin` → **Giới thiệu bản thân** → **Thông tin cá nhân** → sửa các ô Facebook / Instagram / Gmail / TikTok → **Save**.
Bỏ trống ô nào thì nút đó tự ẩn. Gmail chỉ cần ghi địa chỉ (ví dụ `ten@gmail.com`), web tự tạo link `mailto:` và nút “Sao chép email”.

### Gắn tên miền riêng

1. Mua tên miền (phần này có phí, nên là tuỳ chọn). Hoặc cứ dùng `*.pages.dev` miễn phí.
2. Cloudflare → Workers & Pages → `portfolio` → **Custom domains** → **Set up a custom domain** → làm theo hướng dẫn.
3. Cập nhật tên miền mới ở:
   - `astro.config.mjs` → `site`
   - `public/admin/config.yml` → `site_url`, `display_url`
   - Worker `sveltia-cms-auth` → biến `ALLOWED_DOMAINS` (thêm tên miền mới)
   - GitHub OAuth App → **Homepage URL** (callback URL giữ nguyên)

---

## 6. Lưu ý về dung lượng ảnh

- Nên nén mỗi ảnh **dưới ~2–3MB** trước khi upload. CMS đã tự chuyển sang WebP, nhưng ảnh gốc càng nhỏ thì upload càng nhanh.
- Cloudflare Pages giới hạn **25MB mỗi file** và **20.000 file** mỗi lần deploy.
- Mọi ảnh đều nằm trong repo (`src/assets/uploads`). GitHub khuyên repo nên dưới ~1GB. Với vài trăm ảnh WebP thì hoàn toàn thoải mái.
- Chụp bản vẽ: chụp thẳng, đủ sáng, cắt bỏ phần bàn thừa. Có thể dùng app như Adobe Scan hoặc Microsoft Lens.
- Ảnh chia sẻ khi gửi link (Facebook, Zalo…) là file `public/og.png` (1200×630). Có thể thay bằng ảnh của bạn, giữ nguyên tên file.

---

## 7. Chạy thử trên máy & cấu trúc thư mục

```bash
npm install
npm run dev       # xem thử ở http://localhost:4321
npm run build     # build ra thư mục dist/
npm run preview   # xem bản build
```

```
public/
  admin/index.html       ← trang CMS (/admin)
  admin/config.yml       ← cấu hình CMS: các ô nhập, nhãn tiếng Việt, gợi ý
  _headers               ← X-Robots-Tag: noindex cho /admin
  og.png                 ← ảnh chia sẻ mạng xã hội
src/
  content/
    works/*.md           ← Tác phẩm
    projects/*.md        ← Đồ án
    journey/*.md         ← Hành trình
    settings/thong-tin.md← Thông tin cá nhân
  assets/uploads/        ← ảnh upload từ CMS (Astro tự tối ưu)
  content.config.ts      ← khai báo dữ liệu (schema)
  components/            ← các phần của trang chủ
  pages/                 ← trang chủ, /tac-pham/[slug], /do-an/[slug], favicon, robots.txt
  styles/global.css      ← màu, font, biến CSS
```

**Đổi màu / font:** sửa các biến ở đầu `src/styles/global.css` (`--bg`, `--accent`, `--serif`…).

**Favicon** tự lấy chữ cái đầu của từ cuối trong tên bạn, đặt trong khung vuông như con dấu.

---

### Gặp lỗi?

| Hiện tượng | Cách xử lý |
| --- | --- |
| Build lỗi trên Cloudflare | Mở log ở Deployments. Thường do nhập sai định dạng ngày, hoặc sửa file `.md` bằng tay bị lỗi YAML. Hãy sửa lại trong CMS. |
| `/admin` báo lỗi đăng nhập | Kiểm tra `base_url` trong `config.yml`, callback URL của OAuth App (phải có `/callback`), và biến `ALLOWED_DOMAINS`. |
| Lưu xong mà web chưa đổi | Chờ 1–2 phút, tải lại trang với Ctrl+F5. Xem trạng thái ở Cloudflare → Deployments. |
| Ảnh không hiện | Ảnh phải được upload qua CMS, nằm trong `src/assets/uploads`. |
