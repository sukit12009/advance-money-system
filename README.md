# ระบบจัดการรายรับรายจ่าย

เว็บแอปสำหรับบันทึกรายรับรายจ่าย โดย frontend เป็น React + Vite + TypeScript และ backend เป็น Google Apps Script ที่ใช้ Google Sheets เป็นฐานข้อมูล

## สิ่งที่มีในโปรเจกต์

- Dashboard สรุปรายรับ รายจ่าย ยอดคงเหลือ จำนวนรายการ และรายการล่าสุด
- ตารางรายการแบบ spreadsheet พร้อม sticky header, horizontal scroll, sort, pagination
- เพิ่ม แก้ไข ลบรายการ พร้อม confirmation dialog และ toast
- ค้นหาและกรองตามประเภท หมวดหมู่ ประเภทเอกสาร สถานะรับเงิน และช่วงวันที่
- คำนวณ running balance จาก date, createdAt, id ตามลำดับคงที่
- จัดการหมวดหมู่ ประเภทเอกสาร ผู้ใช้งาน และ settings
- Frontend validation ด้วย Zod + React Hook Form
- Backend validation และ permission foundation ใน Google Apps Script
- Demo mode ผ่าน localStorage เมื่อยังไม่ได้ตั้งค่า `VITE_API_BASE_URL`
- Tests สำหรับ balance, validation และ CRUD

## โครงสร้างหลัก

```text
src/
  components/
  hooks/
  pages/
  schemas/
  services/
  types/
  utils/
apps-script/
  Code.gs
  Router.gs
  TransactionService.gs
  CategoryService.gs
  PaymentTypeService.gs
  UserService.gs
  SettingsService.gs
  Validation.gs
  Auth.gs
  SheetRepository.gs
  Utils.gs
  Config.gs
```

## รันในเครื่อง

```bash
npm install
npm run dev
```

ถ้ายังไม่ตั้งค่า API URL แอปจะทำงานใน demo mode ด้วยข้อมูลตัวอย่างใน localStorage

## Environment

สร้าง `.env.local`

```text
VITE_API_BASE_URL=https://script.google.com/macros/s/xxxxx/exec
```

ห้ามใส่ Google credentials หรือ private API key ใน frontend

## Google Sheets schema

สร้าง spreadsheet ที่มีชีตต่อไปนี้

```text
transactions
categories
payment_types
users
settings
```

คอลัมน์:

```text
transactions:
id, date, type, operationDate, description, categoryId, amount, paymentTypeId, received, note, createdAt, updatedAt, createdBy, updatedBy

categories:
id, name, type, active, sortOrder

payment_types:
id, name, active, sortOrder

users:
id, email, name, role, active, createdAt

settings:
key, value
```

## ติดตั้ง Google Apps Script backend

1. สร้าง Google Spreadsheet ใหม่
2. เปิด Apps Script หรือใช้ clasp
3. คัดลอกไฟล์ใน `apps-script/` เข้าโปรเจกต์ Apps Script
4. ตั้งค่า Script Property ชื่อ `SPREADSHEET_ID` เป็น ID ของ spreadsheet
5. รันฟังก์ชัน `setupSpreadsheet()` หนึ่งครั้งเพื่อสร้างชีต header และ sample data
6. Deploy เป็น Web App
7. นำ URL `/exec` ไปใส่ใน `VITE_API_BASE_URL`

ค่า deploy ที่แนะนำขึ้นกับรูปแบบ auth:

- ใช้ภายใน Google Workspace: execute as user accessing the web app และจำกัด domain
- ใช้แบบง่าย/ต้นทุนต่ำ: execute as me แล้วควบคุมผู้ใช้ใน `users` sheet ตามข้อจำกัดของ Apps Script

## API actions

GET:

```text
?action=transactions
?action=transaction&id=TX-...
?action=categories
?action=paymentTypes
?action=users
?action=settings
```

POST body:

```json
{ "action": "createTransaction", "data": {} }
{ "action": "updateTransaction", "id": "TX-...", "data": {} }
{ "action": "deleteTransaction", "id": "TX-..." }
```

Frontend ส่ง POST เป็น `text/plain;charset=utf-8` เพื่อหลีกเลี่ยง CORS preflight ของ Apps Script

## ทดสอบและ build

```bash
npm test
npm run build
```

## Deploy frontend ไป Vercel

1. Push โปรเจกต์ขึ้น GitHub
2. Import repo ใน Vercel
3. ตั้งค่า environment variable `VITE_API_BASE_URL`
4. Build command: `npm run build`
5. Output directory: `dist`

`vercel.json` ตั้ง rewrite ไว้แล้วเพื่อให้ React Router ทำงานเมื่อ refresh path ย่อย
