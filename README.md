<div align="center">
  <img src="https://raw.githubusercontent.com/dnd-kit/logo/master/dnd-kit-logo.svg" alt="TaskFlow Logo" width="120" />
  <h1>TaskFlow — Kanban Yönetim Tahtası</h1>
  <p><strong>Modern, Hızlı ve Akıcı Bir Görev Yönetim Deneyimi</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Prisma-7.8-0C344B?style=for-the-badge&logo=prisma" alt="Prisma" />
    <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="TailwindCSS" />
    <img src="https://img.shields.io/badge/PostgreSQL-Neon-336791?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  </p>
</div>

<br />

## 🌟 Proje Hakkında

**TaskFlow**, ekiplerin veya bireylerin projelerini düzenlemelerine yardımcı olan, **Trello benzeri** bir Kanban panosu uygulamasıdır. Kullanıcılar panolar oluşturabilir, listeler (sütunlar) ekleyebilir ve görevlerini (kartlar) sezgisel bir şekilde sürükleyip bırakarak durumlarını güncelleyebilirler.

Modern web standartlarına uygun şekilde "Mobile-First" (Mobil Öncelikli) yaklaşımla tasarlanmış olup, hem masaüstü hem de mobil cihazlarda kusursuz bir deneyim sunar.

---

## ✨ Öne Çıkan Özellikler

<table>
  <tr>
    <td width="50%">
      <h3>🔄 Akıcı Sürükle-Bırak (Drag & Drop)</h3>
      <p><code>@dnd-kit/react</code> kütüphanesi kullanılarak kartların pürüzsüz ve performanslı şekilde taşınması sağlandı. Optimistic UI yaklaşımı sayesinde siz kartı bıraktığınız an arayüz anında güncellenir.</p>
    </td>
    <td width="50%">
      <h3>🔒 Güvenli Kimlik Doğrulama</h3>
      <p><code>NextAuth.js v5</code> ve <code>BcryptJS</code> ile güçlendirilmiş, baştan sona güvenli kayıt olma ve e-posta/şifre ile giriş yapma (Credentials Provider) altyapısı.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>📱 Tam Mobil Uyumluluk</h3>
      <p>Yatay kaydırma (horizontal scroll) mekanikleri ve dokunmatik ekranlar (touch sensors) ile tam uyumlu çalışan Kanban tahtası. Ekran boyutuna göre otomatik uyarlanan akıllı Grid sistemleri.</p>
    </td>
    <td width="50%">
      <h3>🚀 Yüksek Performans (Fractional Indexing)</h3>
      <p>Kartların sıralaması (ordering), geleneksel <i>tam sayı</i> yerine <i>kesirli indeksleme (float)</i> mantığı kullanılarak çözüldü. Bu sayede veritabanında sadece yeri değişen tek bir satır güncellenir (O(1) Karmaşıklığı).</p>
    </td>
  </tr>
</table>

---

## 🛠 Kullanılan Teknolojiler

- **Frontend:** Next.js 15 (App Router, Server Actions), React 19, TailwindCSS, dnd-kit
- **Backend:** Next.js API Routes (Route Handlers)
- **Veritabanı & ORM:** Prisma v7, PostgreSQL (Neon Serverless)
- **Güvenlik:** NextAuth.js (v5 Beta), BcryptJS
- **Tasarım Dili:** Glassmorphism, Dark Theme

---

## 🚀 Kurulum & Çalıştırma (Lokal Ortam)

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyin.

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/KULLANICI_ADINIZ/taskflow.git
cd taskflow
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Çevre Değişkenlerini (Environment Variables) Ayarlayın
Proje ana dizininde `.env` isimli bir dosya oluşturun ve içini aşağıdaki gibi doldurun:
```env
# Neon veya kendi PostgreSQL veritabanı bağlantınız
DATABASE_URL="postgresql://kullanici:sifre@host/veritabani_adi?sslmode=require"

# NextAuth için güvenlik anahtarı (Rastgele bir metin olabilir)
NEXTAUTH_SECRET="gizli-guvenlik-anahtariniz"
NEXTAUTH_URL="http://localhost:3000"
AUTH_TRUST_HOST=true
```

### 4. Veritabanını Hazırlayın
Prisma şemasını kullanarak veritabanı tablolarını oluşturun:
```bash
npx prisma db push
```

### 5. Uygulamayı Başlatın
```bash
npm run dev
```
Uygulama `http://localhost:3000` adresinde çalışmaya başlayacaktır. 🎉

---

## ☁️ Vercel Üzerinde Canlıya Alma (Deploy)

Uygulamanın GitHub deponuzu kullanarak doğrudan Vercel üzerinde canlıya alınması son derece basittir:

1. **Vercel** platformuna giriş yapın ve `Add New... > Project` seçeneğine tıklayın.
2. Bu projenin GitHub deposunu seçip `Import` butonuna basın.
3. Çıkan ayarlar ekranında **Environment Variables** bölümünü açarak `.env` dosyanızdaki `DATABASE_URL`, `NEXTAUTH_SECRET` ve `AUTH_TRUST_HOST` değişkenlerini girin.
4. `Deploy` tuşuna basın. 
*(Proje içerisinde bulunan `postinstall: prisma generate` komutu sayesinde Vercel derleme esnasında Prisma istemcisini otomatik olarak oluşturacaktır.)*

---

> Proje gereksinimleri doğrultusunda **48 saat** gibi kısa bir sürede, yüksek kalite standartlarında kodlanmıştır. Geliştirmeler ve pull request'ler her zaman açıktır. 
