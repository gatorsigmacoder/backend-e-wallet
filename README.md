### GUIDE TO RUN THE APP 👍

1. Copy env berikut:

```
DB_USER=postgres #sesuaikan dengan nama user postgresql masing-masing
DB_PASSWORD=postgres #sesuaikan dengan password postgresql masing-masing
DB_HOST=localhost #localhost untuk development
DB_PORT=5432 #sesuaikan dengan port postgresql masing-masing
DB_NAME=e_wallet #sesuaikan dengan nama database yang telah dibuat

JWT_ACCESS_SECRET=batudibalikudang
JWT_ACCESS_EXPIRES_IN=3600

NODE_ENV=development

APP_PORT=3000 #port APInya
APP_NAME="E-Wallet"

MAIL_HOST="sandbox.smtp.mailtrap.io"
MAIL_PORT=2525
MAIL_USER=2754ecb923fe63
MAIL_PASSWORD=f4b7da638126b5

REDIS_HOST=localhost
REDIS_PORT=6379
```

sesuaikan dengan settingan pada lokal masing-masing.

2. Kemudian jalankan perintah berikut.

```
pnpm install
```

atau

```
npm install
```

3. Jika sudah maka selanjutnya bisa menjalankan perintah berikut.

```
pnpm run db:init
```

atau

```
npm run db:init
```

4. Kemudian jika berhasil jalankan perintah selanjutnya.

```
pnpm run db:migrate
```

atau

```
npm run db:migrate
```

5. Jika migrate tidak berhasil, saya sediakan backup database postgresql nya.
6. Kemudian jalankan perintah-perintah berikut.

```
pnpm run dev
```

dan

```
pnpm run worker:dev
```

Note:

- Pastikan redis sudah berjalan pada host masing-masing
- Pada project ini juga saya sertakan postman untuk mengakses API
