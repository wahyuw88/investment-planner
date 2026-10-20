# Rencana — Investment Planner

Aplikasi simulasi investasi rutin berbasis Next.js App Router, TypeScript, Tailwind-free custom CSS, dan Recharts.

## Fitur MVP
- Simulasi setoran harian, mingguan, atau bulanan
- Imbal hasil tahunan, durasi, modal awal, dan waktu setoran
- Ringkasan total setoran, nilai akhir, dan estimasi keuntungan
- Grafik pertumbuhan nilai investasi
- Tabel proyeksi tahunan
- Kalkulator setoran untuk target dana
- Perbandingan tiga skenario imbal hasil
- Ekspor proyeksi ke CSV
- Kalkulasi berjalan di browser; tidak ada data finansial yang dikirim ke server

## Persyaratan
- Node.js 20.9 atau lebih baru
- npm

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000.

## Uji rumus dan build

```bash
npm test
npm run build
```

## Deploy publik (Vercel)
1. Push folder project ini ke repository GitHub.
2. Import repository di Vercel.
3. Gunakan konfigurasi Next.js default.
4. Deploy. Tidak perlu environment variables untuk MVP ini.

## Model perhitungan
Imbal hasil tahunan efektif dikonversi ke tingkat per periode:
`periodicRate = (1 + annualRate)^(1 / periodsPerYear) - 1`

Setoran rutin diasumsikan pada awal atau akhir periode. Modal awal bertumbuh selama seluruh durasi. Frekuensi menggunakan konvensi 365 periode/tahun untuk harian, 52 untuk mingguan, dan 12 untuk bulanan.

## Catatan penting sebelum peluncuran publik
- Hasil merupakan simulasi matematis, bukan proyeksi pasti atau nasihat investasi.
- Return aktual berfluktuasi; biaya, pajak, inflasi, dan hari libur tidak dimodelkan.
- Tambahkan halaman privasi, disclaimer, aksesibilitas, dan metadata sosial sebelum peluncuran.
- Tambahkan monitoring error dan analytics hanya setelah meninjau kebutuhan privasi.
- Jika menambah akun/penyimpanan cloud, jangan simpan data finansial tanpa kontrol akses dan kebijakan privasi yang jelas.
