# Fern UI Style Guide

คู่มือ style สำหรับ React/Tailwind ของโปรเจกต์ Fern ระบบจัดการรายรับรายจ่ายภาษาไทย

## Design tokens

- ใช้ tokens จาก `src/index.css` และ aliases ใน `tailwind.config.ts`: `primary`, `background`, `surface`, `border`, `muted`, `muted-foreground`, `success`, `warning`, `destructive`
- พื้นหลังหลักเป็น slate อ่อน; content surface เป็น white
- Teal ใช้สำหรับ primary action, active navigation และ link สำคัญ
- Emerald ใช้สำหรับ income/success; rose สำหรับ expense/danger; amber สำหรับ pending/warning; slate สำหรับ neutral
- หลีกเลี่ยงการสร้างสีใหม่ถ้า token เดิมรองรับอยู่แล้ว

## Shape, spacing และ typography

- Card, section, table และ dialog: `rounded-lg border border-border bg-white shadow-sm`
- Button, input, select และ nav item: `rounded-md`
- Badge/status: `rounded-full`
- Card มาตรฐาน: `p-4`; modal content: `px-5 py-5`
- Page rhythm: `space-y-5`; grid/form: `gap-3` หรือ `gap-4`
- Page title: `text-2xl font-semibold text-slate-950`
- Section title: `text-lg font-semibold text-slate-950`
- Label: `text-sm font-medium text-slate-700`
- Helper text: `text-sm text-muted-foreground`
- Error: `text-xs text-red-600`

## Components

- ใช้ `PageHeader` สำหรับ heading ของหน้ามาตรฐาน
- ใช้ `Button` จาก `src/components/ui/Button.tsx` แทนการเขียนปุ่มเอง: `primary`, `secondary`, `ghost`, `danger`
- ใช้ `Input`, `Select`, `Textarea`, `Label`, `FieldError` จาก `FormControls`
- ใช้ `Badge` สำหรับประเภทและสถานะ
- ใช้ `LoadingBlock`, `ApiLoadingOverlay`, `EmptyState` สำหรับ loading/error/empty state
- ตรวจ `src/components/common` และ `src/components/ui` ก่อนสร้าง primitive ใหม่

## Layout และ responsive

- ใช้ shell และ max-width จาก `AppLayout`; อย่าสร้าง global shell ซ้ำ
- รักษา fixed top-right profile header และ horizontally scrollable tables
- Actions ใช้ `flex gap-2` และต้อง wrap/stack บน narrow viewport
- เริ่มจาก single column แล้วเพิ่ม `sm:`, `md:`, `lg:` เมื่อจำเป็น
- ห้ามทำให้ page overflow

## Tables

- wrapper ใช้ `overflow-x-auto`
- header ใช้ `bg-slate-50 text-left text-slate-600`
- row ใช้ `border-t border-border`
- cell ใช้ `px-3 py-3` หรือ `px-4 py-3`
- action icon ต้องมี `title` และ `aria-label`

## Dashboard

Dashboard เป็น overview ไม่ใช่ Transactions อีกหน้า:

- ใช้ summary cards, category/trend bars และ pending/status signals
- แสดงข้อมูลที่ตอบว่า “สถานะตอนนี้เป็นอย่างไร” และ “ควรทำอะไรต่อ”
- ใช้ links ไปหน้ารายละเอียดแทน full transaction table และ filters
- ใช้ card style เดียวกับ `SummaryCards`

## Accessibility และ handoff

- ใช้ Lucide icons ขนาด `h-4 w-4` ใน controls และ `h-5 w-5` ใน cards/status
- Icon button ต้องมี accessible label
- รักษา focus-visible และ keyboard interaction
- ทดสอบ desktop และ narrow viewport
- ตรวจ loading, error, empty และ long-text state
- คง Thai labels และข้อความเดิม เว้นแต่ requirement ขอเปลี่ยน
- รัน `npm run lint` และ `npm run build` เมื่อ environment อนุญาต
