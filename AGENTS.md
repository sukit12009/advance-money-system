# AGENTS.md

## Project overview

โปรเจกต์นี้เป็นเว็บภาษาไทยสำหรับจัดการรายรับและรายจ่าย ใช้ React + Vite + TypeScript ที่ `src/` และ Google Apps Script ที่ `apps-script/` โดยใช้ Google Sheets เป็น data store เมื่อไม่มี `VITE_API_BASE_URL` frontend จะใช้ demo mode ผ่าน `localStorage`

## Development commands

รันจาก repository root:

```bash
npm install
npm run dev
npm run build
npm test
npm run lint
```

หลังแก้ไขให้รัน test/check ที่เกี่ยวข้อง และรัน build เมื่อทำ frontend change หาก environment อนุญาต

## Frontend conventions

- ใช้ React function components และ hooks อย่างถูกต้อง ห้ามเรียก hook แบบ conditional
- ใช้ component ที่มีอยู่ใน `src/components/ui` และ `src/components/common` ก่อนสร้างใหม่
- เก็บ API calls ใน `src/services/api.ts` และให้ React Query hooks จัดการ cache invalidation/toast
- ใช้ TypeScript types, Zod schemas, Tailwind classes และ Lucide icons เดิม
- คง Thai labels และข้อความเดิม เว้นแต่ requirement ขอเปลี่ยน
- Global loading overlay ต้อง block หน้าเมื่อ API ทำงาน ห้ามเปลี่ยน button text ระหว่าง request
- รักษา responsive behavior โดยเฉพาะ profile header และตารางที่ต้อง horizontal scroll

## Backend conventions

- ไฟล์ `.gs` ใช้ global Apps Script runtime ห้ามใช้ module syntax
- route API action ใหม่ผ่าน `apps-script/Router.gs`
- ตรวจ authorization ทั้ง route boundary และ service layer
- ใช้ session/current-user mechanism ใน `Auth.gs` ไม่ใช้ `Session.getEffectiveUser()` เป็น primary app identity
- ใช้ `SheetRepository` สำหรับอ่าน/เขียนข้อมูล
- validation backend อยู่ใน `Validation.gs` และใช้ JSON success/error shape ของโปรเจกต์
- ห้ามส่งหรือ render `passwordHash` และ password
- category/payment type: disable เป็น soft disable (`active=false`), delete เป็น permanent deletion และทั้งคู่ admin-only

## Authentication and authorization

- Login ใช้ email/password และ password ต้องเก็บเป็น secure hash พร้อม salt
- Backend permission เป็น authority ห้ามเชื่อ role จาก local state อย่างเดียว
- `registerUser` เปิดแบบ bootstrap ได้เฉพาะเมื่อยังไม่มี user; หลังจากนั้นต้องมี `users:manage`
- ตรวจสิทธิ์ทุก API action และป้องกัน field ภายใน เช่น `id`, `createdAt`, `passwordHash`
- token ต้อง revoke เมื่อ logout และเปลี่ยน password ตาม implementation ปัจจุบัน

## Data and API changes

เมื่อเพิ่มหรือเปลี่ยน API action ให้ปรับทุก layer ที่เกี่ยวข้อง:

1. `src/services/apiTypes.ts` และ API method
2. demo-mode behavior
3. routing ใน `apps-script/Router.gs`
4. backend service, validation และ permission
5. React Query mutation/query invalidation และ feedback

สำหรับ date ให้ใช้ `operationDateStart` และ `operationDateEnd`; single-day range ต้องเก็บสอง field เป็นวันเดียวกัน

## UI style

- อ่าน [ui-style.md](docs/ui-style.md) ก่อนทำ UI change และดูเอกสารเพิ่มเติมใน [docs/README.md](docs/README.md)
- ใช้ `PageHeader`, `Button`, `Badge`, `FormControls`, `EmptyState`, `LoadingBlock` และ `ApiLoadingOverlay` ที่มีอยู่แล้ว
- ใช้ `rounded-lg border border-border bg-white shadow-sm` สำหรับ card/section มาตรฐาน
- Dashboard เป็น overview ไม่ใช่ duplicate ของ transaction table

## Verification checklist

- ตรวจ `git diff --check`
- รัน relevant tests, `npm run lint` และ `npm run build` เมื่อทำได้
- ทดสอบ demo mode และ remote API สำหรับ API change
- ทดสอบ desktop และ narrow viewport
- สำหรับ admin-only action ทดสอบทั้ง admin และ non-admin
- ตรวจ `git status` และไม่รวม unrelated changes

## Git workflow

- ทำ focused commits พร้อมข้อความที่ชัดเจน
- ห้าม reset, discard หรือ overwrite unrelated changes
- ห้าม push จนกว่าผู้ใช้จะขอโดยตรง
