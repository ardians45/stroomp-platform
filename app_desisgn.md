## ## Deskripsi Teknis Antarmuka STROOMP (Untuk AI Agent)

Dokumen ini berisi spesifikasi teknis untuk membangun antarmuka pengguna (UI) STROOMP berdasarkan gambar yang disediakan. Semua nilai `px` adalah estimasi untuk mencapai hasil yang presisi.

### **1. Design Tokens & Properti Global**

Ini adalah variabel dasar yang akan digunakan di seluruh aplikasi untuk konsistensi.

- **Warna (Palette):**
  - `--background-primary`: `#18181b` (Abu-abu gelap untuk latar utama)
  - `--background-secondary`: `#242427` (Abu-abu sedikit lebih terang untuk sidebar, card)
  - `--accent-primary`: `#fcfa1b` (Kuning untuk tombol, highlight, tag "LIVE")
  - `--accent-primary-hover`: `#e6e419` (Kuning lebih gelap untuk hover)
  - `--text-primary`: `#FFFFFF` (Putih untuk teks utama)
  - `--text-secondary`: `#a1a1aa` (Abu-abu terang untuk teks sekunder, jumlah viewer)
  - `--border-primary`: `#3f3f46` (Abu-abu untuk garis pemisah/border)

- **Tipografi (Typography):**
  - `--font-family`: `'Inter', sans-serif` (Gunakan font Inter atau sans-serif modern lainnya)
  - `--font-size-xs`: `12px`
  - `--font-size-sm`: `14px`
  - `--font-size-base`: `16px`
  - `--font-size-lg`: `18px`
  - `--font-size-xl`: `24px`
  - `--font-weight-normal`: `400`
  - `--font-weight-medium`: `500`
  - `--font-weight-bold`: `700`

- **Spacing & Sizing:**
  - `--spacing-unit`: `4px` (Gunakan kelipatan dari 4px untuk padding, margin, gap)
  - `--border-radius-sm`: `4px`
  - `--border-radius-md`: `8px`

### **2. Struktur Layout Utama**

Halaman menggunakan layout 2 kolom utama: `Sidebar Kiri` (fixed) dan `Konten Utama` (scrollable).

- **Container Utama (`<body>`):**
  - `background-color`: `var(--background-primary)`
  - `color`: `var(--text-primary)`
  - `font-family`: `var(--font-family)`
  - `display`: `grid`
  - `grid-template-columns`: `240px 1fr` (Sidebar 240px, sisa ruang untuk konten)
  - `grid-template-rows`: `1fr auto` (Konten utama dan footer)

### **3. Sidebar Kiri (Komponen: `<Sidebar>`)**

- **Positioning:** `position: fixed`, `left: 0`, `top: 0`, `height: 100vh`, `width: 240px`
- **Styling:**
  - `background-color`: `var(--background-secondary)`
  - `padding`: `24px`
- **Elemen:**
  - **Logo:** Di atas, `height: 40px`.
  - **Blok Navigasi:**
    - `margin-top`: `40px`.
    - **Item Navigasi (Contoh: HOME):**
      - `display`: `flex`, `align-items`: `center`, `gap`: `16px`.
      - `padding`: `12px`.
      - `border-radius`: `var(--border-radius-md)`.
      - `font-size`: `var(--font-size-base)`.
      - `font-weight`: `var(--font-weight-medium)`.
      - **State Aktif (HOME):** `background-color`: `var(--background-primary)`.
      - **State Hover:** `background-color`: `rgba(255, 255, 255, 0.1)`.

### **4. Konten Utama (Area Kanan)**

- **Positioning:** `grid-column`: `2 / 3` (mengambil kolom kedua).
- **Layout:** Terdiri dari `Header` dan `Main Content Area`.

#### **Header (Komponen: `<Header>`)**

- **Positioning:** `position: sticky`, `top: 0`, `z-index: 10`.
- **Styling:**
  - `display`: `flex`, `justify-content`: `space-between`, `align-items`: `center`.
  - `height`: `60px`.
  - `padding`: `0 24px`.
  - `background-color`: `var(--background-primary)`.
  - `border-bottom`: `1px solid var(--border-primary)`.
- **Elemen (dari kiri ke kanan):**
  - **Navigasi Kategori (`GAMING`, `IRL`, ...):**
    - `display`: `flex`, `gap`: `24px`.
    - **Item Kategori:** `font-size`: `var(--font-size-base)`, `font-weight`: `var(--font-weight-bold)`, `padding`: `8px 0`.
    - **State Aktif (GAMING):** `color`: `var(--accent-primary)`, `border-bottom`: `2px solid var(--accent-primary)`.
  - **Search Bar:** `width: 200px`.
  - **Grup Ikon & Tombol:** `display`: `flex`, `align-items`: `center`, `gap`: `16px`.
    - **Tombol (UPLOAD, SUBSCRIBE):** `background-color`: `var(--accent-primary)`, `color`: `var(--background-primary)`, `font-weight`: `var(--font-weight-bold)`, `padding`: `8px 16px`, `border-radius`: `var(--border-radius-md)`.

#### **Main Content Area**

- **Styling:** `padding`: `24px`.

- **Stream Unggulan (Komponen: `<FeaturedStreamCard>`)**
  - `position`: `relative`, `aspect-ratio`: `16 / 9`, `border-radius`: `var(--border-radius-md)`, `overflow`: `hidden`.
  - **Gambar Latar:** `width: 100%`, `height: 100%`, `object-fit: cover`.
  - **Overlay Teks:** `position: absolute`, `bottom: 0`, `left: 0`, `width: 100%`, `padding`: `24px`, `background`: `linear-gradient(to top, rgba(0,0,0,0.8), transparent)`.
  - **Tag "LIVE":** `position: absolute`, `top: 16px`, `right: 16px`, `background-color`: `var(--accent-primary)`, `color`: `var(--background-primary)`, `padding`: `4px 8px`, `border-radius`: `var(--border-radius-sm)`, `font-weight`: `var(--font-weight-bold)`.
  - **Judul Stream:** `font-size`: `var(--font-size-xl)`, `font-weight`: `var(--font-weight-bold)`.

- **Grid Stream Populer (Komponen: `<StreamGrid>`)**
  - **Judul Seksi ("POPULAR STREAMS"):** `margin-top`: `32px`, `margin-bottom`: `16px`, `font-size`: `var(--font-size-lg)`, `font-weight`: `var(--font-weight-bold)`.
  - **Grid Container:** `display`: `grid`, `grid-template-columns`: `repeat(auto-fill, minmax(280px, 1fr))`, `gap`: `20px`.

- **Kartu Stream Individual (Komponen: `<StreamCard>`)**
  - **Container Kartu:** `width: 100%`.
  - **Thumbnail Container:** `position: relative`, `aspect-ratio: 16 / 9`, `border-radius`: `var(--border-radius-md)`, `overflow`: `hidden`.
  - **Tag "LIVE":** Sama seperti di _featured stream_, tapi lebih kecil (`padding: 2px 6px`, `font-size: var(--font-size-xs)`).
  - **Info di Bawah Thumbnail:** `margin-top: 12px`, `display`: `flex`, `gap`: `12px`.
    - **Avatar Streamer:** `width: 40px`, `height: 40px`, `border-radius: 50%`.
    - **Blok Teks:**
      - **Nama Streamer:** `font-size`: `var(--font-size-base)`, `font-weight`: `var(--font-weight-medium)`, `color`: `var(--text-primary)`.
      - **Jumlah Viewer:** `font-size`: `var(--font-size-sm)`, `color`: `var(--text-secondary)`.

### **5. Footer (Komponen: `<Footer>`)**

- **Positioning:** `grid-column: 2 / 3` (di bawah konten utama).
- **Styling:** `display`: `flex`, `gap`: `24px`, `padding`: `24px`, `border-top`: `1px solid var(--border-primary)`.
- **Tautan Footer:** `font-size`: `var(--font-size-sm)`, `color`: `var(--text-secondary)`.
