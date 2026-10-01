Hãy xây dựng cho tôi một website portfolio cá nhân hoàn toàn MIỄN PHÍ (0đ), lưu code trên một GitHub repo PUBLIC và host bằng Cloudflare Pages. Làm từ đầu đến cuối: tạo code, cấu hình, và viết hướng dẫn deploy từng bước bằng tiếng Việt.

## 1. Chủ sở hữu & mục đích
- Chủ sở hữu: sinh viên năm 1 ngành Kiến trúc, Trường Đại học Kiến trúc TP.HCM (UAH – University of Architecture Ho Chi Minh City).
- Mục đích: portfolio để trưng bày tranh, ký hoạ, bản vẽ, mô hình, đồ án. Đồng thời là nhật ký ghi lại hành trình học kiến trúc qua từng học kỳ tại UAH.
- Toàn bộ nội dung bằng tiếng Việt. Mọi font phải hỗ trợ đầy đủ dấu tiếng Việt.
- Tôi sẽ tự thêm ảnh sau. Hiện tại dùng placeholder đẹp, không dùng ảnh stock. Khung placeholder có tỉ lệ khác nhau, viền mảnh, ghi chữ "Tác phẩm sắp ra mắt".

## 2. Stack kỹ thuật (bắt buộc miễn phí)
- Framework: Astro (static output) + Content Collections. Không cần backend hay database.
- CMS: Sveltia CMS (thay thế hiện đại cho Decap CMS, dùng chung định dạng config.yml), backend GitHub, đặt tại /admin.
  - Đăng nhập GitHub qua OAuth bằng Cloudflare Worker miễn phí (sveltia-cms-auth). Hướng dẫn tạo GitHub OAuth App và deploy Worker.
  - Phương án dự phòng: đăng nhập bằng GitHub Personal Access Token.
  - KHÔNG được để bất kỳ secret/token nào trong repo vì repo là public. Client secret chỉ đặt trong biến môi trường của Worker.
- Ảnh upload qua CMS được commit thẳng vào repo. Bật tự động nén/chuyển sang WebP khi upload nếu CMS hỗ trợ. Website hiển thị ảnh responsive (srcset) và lazy-load.
- Mỗi lần lưu trong CMS sẽ commit lên GitHub, Cloudflare Pages tự build lại (~1–2 phút).
- Không dùng dịch vụ trả phí hay có giới hạn dùng thử.

## 3. "Chế độ kiến trúc sư" (/admin)
- Footer có một nút nhỏ, kín đáo: "✎ Chế độ kiến trúc sư", dẫn tới /admin.
- Sau khi đăng nhập ở /admin, tôi phải làm được bằng nút bấm trên giao diện (không phải sửa code):
  1. Thêm / sửa / xoá TÁC PHẨM (upload một hoặc nhiều ảnh).
  2. Thêm / sửa / xoá ĐỒ ÁN (dự án nhiều bước, nhiều ảnh).
  3. Thêm / sửa các mốc trong HÀNH TRÌNH HỌC TẬP.
  4. Sửa GIỚI THIỆU BẢN THÂN, ảnh đại diện và link mạng xã hội.
- Label mọi field viết bằng tiếng Việt, có gợi ý (hint) ngắn.
- Thêm header X-Robots-Tag: noindex cho /admin.

## 4. Mô hình dữ liệu (CMS config + Astro content schema)
- Tác phẩm (works): tiêu đề, ảnh chính, bộ ảnh phụ, ngày hoàn thành, danh mục [Ký hoạ, Màu nước, Chì & Mực, Bản vẽ kỹ thuật, Mô hình, Kỹ thuật số, Khác], chất liệu, kích thước (ví dụ A3, 30×40cm), học kỳ (ví dụ "HK1 – Năm 1"), mô tả ngắn, nổi bật (true/false), thứ tự hiển thị.
- Đồ án (projects): tiêu đề, môn học, học kỳ, ảnh bìa, và các phần: Đề bài / Bối cảnh, Ý tưởng, Quá trình (danh sách bước, mỗi bước gồm ảnh + chú thích), Kết quả (gallery), Điều tôi học được. Có thêm điểm/nhận xét của giảng viên (tuỳ chọn, có thể ẩn).
- Hành trình (journey): ngày/học kỳ, tiêu đề (ví dụ "Ngày đầu nhập học UAH", "Môn Hình hoạ 1", "Đồ án đầu tiên"), nội dung markdown, ảnh (tuỳ chọn), liên kết tới tác phẩm/đồ án liên quan (tuỳ chọn).
- Thông tin cá nhân (settings, file đơn): tên, biệt danh, tagline, ảnh đại diện, đoạn giới thiệu, trường, năm học, kỹ năng/công cụ (ví dụ chì, màu nước, SketchUp, AutoCAD…), Facebook URL, Instagram URL, Gmail (hiển thị dạng mailto:), TikTok URL.
- Tạo sẵn vài mục mẫu cho mỗi loại để website không bị trống.

## 5. Cấu trúc trang
Menu dính trên đầu (sticky), nền mờ trong suốt (backdrop-blur), gồm: Tác phẩm · Đồ án · Hành trình · Về tôi · Liên hệ. Trên mobile chuyển thành menu hamburger toàn màn hình, chữ lớn.

Trang chủ (một trang cuộn dọc):
1. HERO: tên rất lớn (font serif), tagline "Sinh viên Kiến trúc năm 1 · UAH · Vẽ – Dựng – Học". Nền tối có lưới kẻ mờ như giấy bản vẽ, có đường dẫn kích thước (dimension lines) và một dòng toạ độ trang trí kiểu "10.7769° N, 106.6953° E". Có chỉ báo "Cuộn xuống".
2. NỔI BẬT: dải cuộn NGANG chứa 3–6 tác phẩm/đồ án nổi bật, ảnh lớn gần toàn màn hình (cuộn bằng lăn chuột, kéo, hoặc vuốt), mỗi ảnh có nhãn "FIG. 01".
3. TÁC PHẨM: có nút chuyển giữa 2 chế độ xem:
   - LƯỚI: masonry so le kiểu Pinterest. Hover thì ảnh sáng lên nhẹ và hiện tiêu đề + chất liệu.
   - DANH SÁCH (Index): bảng tối giản gồm các cột Năm · Tên · Danh mục · Chất liệu. Hover một dòng thì ảnh xem trước hiện ra bám theo con trỏ (trên mobile thì hiện thumbnail nhỏ trong dòng).
   - Có bộ lọc theo danh mục (chip). Click ảnh mở lightbox toàn màn hình: nút trước/sau, phím mũi tên, Esc, vuốt trên mobile, chú thích bên dưới kiểu tạp chí (FIG. số · tiêu đề · chất liệu · kích thước · học kỳ).
4. ĐỒ ÁN: thẻ lớn dạng ảnh bìa + tên + môn + học kỳ, dẫn tới trang chi tiết.
5. HÀNH TRÌNH TẠI UAH: timeline dọc theo học kỳ, mốc mới nhất ở trên. Đường timeline chạy dọc và "vẽ dần" khi cuộn. Mỗi mốc có ngày, tiêu đề, đoạn ngắn và ảnh nhỏ.
6. VỀ TÔI: ảnh đại diện (có thể để đen trắng, hover thì có màu), giới thiệu, trường và năm học, kỹ năng/công cụ dạng tag, các con số tự đếm (số tác phẩm, số đồ án, số học kỳ).
7. LIÊN HỆ: dòng chữ lớn "Cùng trò chuyện nhé" + 4 nút icon + chữ cho Facebook, Instagram, Gmail, TikTok (icon SVG inline/Simple Icons). Gmail mở mailto: và có nút "Sao chép email" kèm thông báo "Đã sao chép".
8. FOOTER: © năm hiện tại, tên, "Made in Sài Gòn", nút "✎ Chế độ kiến trúc sư".

Trang chi tiết:
- /tac-pham/[slug]: ảnh lớn, thông tin, gallery phụ, nút tác phẩm trước/sau.
- /do-an/[slug]: bố cục kiểu tạp chí. Ảnh bìa toàn màn hình, rồi lần lượt Đề bài → Ý tưởng → Quá trình (ảnh và chữ đặt xen kẽ trái/phải) → Kết quả → Điều tôi học được. Có thanh tiến độ đọc ở trên cùng.

## 6. Thiết kế – NỀN TỐI, phong cách "phòng triển lãm + giấy bản vẽ"
Tham khảo các ý sau (không sao chép nguyên):
- Template Framer "dark editorial": nền tối, grain nhẹ, họa tiết chấm/lưới mờ, chữ lớn đậm, gallery ảnh làm trung tâm.
- Portfolio kiến trúc Nicholas Gurney / Jens Van Zele: gallery cuộn ngang, ảnh toàn màn hình.
- Revel Fox & Partners: sắp xếp theo dòng thời gian, mới nhất trước.
- Matt Elkan / GKMP Architects: trang dự án có chữ giải thích bài toán và ý tưởng, xem ảnh chậm rãi từng tấm.
- Laura Valls: lưới masonry so le, có hover animation.
- Template Mastak: phong cách tạp chí, có chỗ cho chú thích.
- deno07.carrd.co: gọn, một cột, menu dính, nhóm ảnh theo danh mục.
- Tinh thần chung: tối giản, để tác phẩm tự nói, nhiều khoảng trống.

Màu (đặt thành CSS variables):
- Nền #0d0d0f · bề mặt thẻ #16161a · viền #2a2a30
- Chữ chính #ece8e1 (trắng ngà) · chữ phụ #8a877f
- Màu nhấn cam đất / gạch nung #c0643f, dùng tiết kiệm (link, đường timeline, nhãn FIG.)

Font (Google Fonts, có tiếng Việt):
- Tiêu đề: "Cormorant Garamond" hoặc "Playfair Display"
- Nội dung & UI: "Be Vietnam Pro"
- Nhãn, số liệu, chú thích: "JetBrains Mono", viết hoa, giãn chữ, như ghi chú trên bản vẽ

Chi tiết & chuyển động:
- Lớp grain rất nhẹ phủ toàn trang; lưới kẻ mờ ở hero.
- Ảnh hiện dần (fade-up) khi cuộn tới; tiêu đề section có số thứ tự kiểu "01 — Tác phẩm".
- Con trỏ tuỳ biến dạng dấu "+" (crosshair) trên desktop, tắt trên thiết bị cảm ứng.
- Mọi animation tôn trọng prefers-reduced-motion.
- Responsive tốt từ 360px đến màn hình lớn, không cuộn ngang ngoài ý muốn (trừ dải Nổi bật).
- Hiệu năng: Lighthouse ≥ 90. Dùng ít JavaScript, chỉ cho lightbox, bộ lọc, chế độ xem, menu, cuộn ngang.
- SEO: title/description, Open Graph image, favicon dạng chữ cái đầu tên trong khung vuông như con dấu kiến trúc, sitemap.
- Accessibility: ảnh có alt (lấy từ field tiêu đề/mô tả trong CMS), focus ring rõ, độ tương phản đạt WCAG AA.

## 7. Bàn giao
- Toàn bộ source code + README.md bằng tiếng Việt cho người mới:
  1. Tạo repo public trên GitHub và push code.
  2. Kết nối repo với Cloudflare Pages (build command, output dir, phiên bản Node).
  3. Tạo GitHub OAuth App + deploy Worker sveltia-cms-auth, điền URL Worker vào admin/config.yml (base_url).
  4. Vào /admin, đăng nhập, thêm tác phẩm đầu tiên và kiểm tra website tự cập nhật.
  5. Cách đổi link mạng xã hội và cách gắn tên miền riêng (tuỳ chọn).
  6. Lưu ý dung lượng: nén ảnh dưới ~2–3MB mỗi ảnh; Cloudflare Pages giới hạn 25MB mỗi file.
- Chạy npm run build để chắc chắn build không lỗi trước khi bàn giao.
- Link mạng xã hội và email để placeholder rõ ràng (ví dụ "https://facebook.com/ten-cua-ban") để tôi điền sau trong CMS.