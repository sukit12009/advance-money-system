# Expense & Income Management Web Application

## 1. Project Overview

Build a web application for managing income and expense records.

The application should replace the current workflow of manually entering data in Google Sheets while continuing to use **Google Sheets as the database**.

The UI should be based on the attached reference image: a spreadsheet-style income/expense table with filters, dropdown fields, status/received checkboxes, running balance, and CRUD actions.

### Main goals

- Manage income and expense transactions.
- Add, edit, delete, and view transactions.
- Search and filter transactions.
- Calculate current balance.
- Manage master data such as categories and payment/document types.
- Use Google Sheets as the persistent data store.
- Keep the frontend independent from Google Sheets.
- Use Google Apps Script as the REST API layer.
- Deploy the frontend on Vercel.
- Keep the architecture simple and inexpensive.

---

# 2. Recommended Technology Stack

## Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Router
- TanStack Query
- Zod
- React Hook Form
- Lucide React

## Backend

- Google Apps Script
- Google Sheets

## Deployment

- Frontend: Vercel
- Backend: Google Apps Script Web App
- Source control: GitHub

## Architecture

```text
Browser
   |
   | HTTPS / REST API
   v
React + Vite
   |
   v
Google Apps Script Web App
   |
   v
Google Sheets
```

Do NOT connect the browser directly to Google Sheets.

The frontend must communicate only with the Google Apps Script API.

---

# 3. Functional Requirements

## 3.1 Dashboard

Create a dashboard showing:

- Total income
- Total expense
- Current balance
- Number of transactions
- Recent transactions

Example:

```text
+------------------------------------------------------+
| รายรับทั้งหมด | รายจ่ายทั้งหมด | ยอดคงเหลือ        |
| ฿80,000       | ฿38,286        | ฿41,714           |
+------------------------------------------------------+

Recent Transactions
--------------------------------------------------------
Date       Type       Description       Amount
17/07/26   Income     เงินเรียนซ่อม     ฿80,000
03/08/26   Expense    เขาใหญ่           ฿7,500
03/08/26   Expense    ชลบุรี            ฿6,500
```

The dashboard must calculate values from transaction data.

Do not store dashboard totals as independent database records.

---

# 4. Transaction Management

Create a transaction management page.

The main table should resemble the reference Google Sheet.

Recommended columns:

1. ID
2. Date
3. Type
4. Operation Date / Description Date
5. Description
6. Category
7. Amount
8. Balance
9. Payment Type
10. Received
11. Note
12. Actions

Example:

```text
| Date       | Type    | Description | Category    | Amount   | Balance | Payment | Received | Actions |
|------------|---------|-------------|-------------|----------|---------|---------|----------|---------|
| 17/07/26   | Income  | เงินเรียน   | เงินโอนจาก รร. | 80,000 | 80,000 | -       | ✓        | Edit    |
| 03/08/26   | Expense | เขาใหญ่     | ค่าเช่ารถ   | 7,500    | 72,500  | ฟอร์ม 2 | ✓        | Edit    |
```

---

# 5. Transaction Types

Support at least:

```text
income
expense
```

Display them in Thai:

```text
รายรับ
รายจ่าย
```

Use a clear visual distinction between income and expense.

Do not hardcode business logic into UI components when it can be represented by configuration or enums.

---

# 6. Create Transaction

Provide a form for creating a transaction.

Fields:

```text
วันที่
ประเภท
วันที่ดำเนินการ
รายการ
หมวดหมู่
จำนวนเงิน
ประเภทเอกสาร / การจ่าย
ได้รับเงินแล้ว
หมายเหตุ
```

Example:

```text
เพิ่มรายการ

วันที่
[ 21/08/2026 ]

ประเภท
[ รายจ่าย ▼ ]

วันที่ดำเนินการ
[ 21/08/2026 ]

รายการ
[ ค่าเดินทาง ]

หมวดหมู่
[ ค่ายานพาหนะ ▼ ]

จำนวนเงิน
[ 500.00 ]

ประเภทเอกสาร
[ ฟอร์ม 2 ▼ ]

ได้รับเงินแล้ว
[ ✓ ]

หมายเหตุ
[ __________________________ ]

[ยกเลิก] [บันทึก]
```

---

# 7. Edit Transaction

Users must be able to edit an existing transaction.

The edit form should use the same validation rules as the create form.

When editing a transaction:

- Keep the existing transaction ID.
- Update only the editable fields.
- Recalculate the running balance.
- Refresh affected transaction rows after saving.

---

# 8. Delete Transaction

Users must be able to delete a transaction.

Before deleting, show a confirmation dialog.

Example:

```text
ต้องการลบรายการนี้หรือไม่?

รายการ: เขาใหญ่
จำนวนเงิน: ฿7,500

[ยกเลิก] [ลบรายการ]
```

After deleting:

- Remove the transaction from Google Sheets.
- Recalculate the running balance.
- Refresh the table.
- Show a success message.

---

# 9. Search and Filters

The transaction page must support:

## Search

Search by:

- Description
- Note
- Category

## Filters

- Type
- Category
- Payment Type
- Received status
- Date range

Example:

```text
ค้นหา
[________________________]

ประเภท
[ทั้งหมด ▼]

หมวดหมู่
[ทั้งหมด ▼]

ประเภทเอกสาร
[ทั้งหมด ▼]

ได้รับเงินแล้ว
[ทั้งหมด ▼]

วันที่เริ่มต้น
[________]

วันที่สิ้นสุด
[________]

[ค้นหา] [รีเซ็ต]
```

Filters should be composable.

---

# 10. Running Balance

Transactions should have a calculated running balance.

Rules:

```text
Income:
balance = previousBalance + amount

Expense:
balance = previousBalance - amount
```

Example:

```text
Starting balance
80,000

Expense 7,500
72,500

Expense 6,500
66,000

Expense 6,500
59,500
```

## Important

Do not use the Google Sheet row number as a transaction ID.

Each transaction must have a permanent unique ID.

Example:

```text
TX-20260821-0001
TX-20260821-0002
TX-20260821-0003
```

The running balance should be recalculated based on transaction order.

Prefer storing the original transaction amount and calculating the balance instead of treating `balance` as the source of truth.

---

# 11. Transaction Ordering

The running balance depends on transaction order.

Use the following order:

1. Transaction date ascending.
2. If the transaction dates are identical, use `createdAt` ascending.
3. If necessary, use transaction ID as a final deterministic sort key.

The backend should return transactions in a deterministic order.

---

# 12. Google Sheets Database Design

Create one Google Spreadsheet with the following sheets.

```text
transactions
categories
payment_types
users
settings
```

---

# 13. transactions Sheet

Recommended columns:

```text
id
date
type
operationDate
description
categoryId
amount
paymentTypeId
received
note
createdAt
updatedAt
createdBy
updatedBy
```

Example:

```text
| id | date | type | operationDate | description | categoryId | amount | paymentTypeId | received | note | createdAt | updatedAt |
```

## Data types

```text
id              string
date            YYYY-MM-DD
type            income | expense
operationDate   string
description     string
categoryId      string
amount          number
paymentTypeId   string
received        boolean
note            string
createdAt       ISO datetime
updatedAt       ISO datetime
createdBy       string
updatedBy       string
```

Do not store formatted currency strings such as `฿7,500.00` in the database.

Store:

```text
7500
```

Formatting should happen in the frontend.

---

# 14. categories Sheet

Columns:

```text
id
name
active
sortOrder
```

Example:

```text
| id | name | active | sortOrder |
| CAT001 | เงินโอนจาก รร. | TRUE | 1 |
| CAT002 | ค่าเช่ารถ | TRUE | 2 |
| CAT003 | ค่ายานพาหนะ | TRUE | 3 |
| CAT004 | ค่าปรับปรุง | TRUE | 4 |
| CAT005 | ค่าซ่อม | TRUE | 5 |
```

Only active categories should appear in normal transaction forms.

---

# 15. payment_types Sheet

Columns:

```text
id
name
active
sortOrder
```

Example:

```text
| id | name | active | sortOrder |
| PAY001 | ฟอร์ม 2 | TRUE | 1 |
| PAY002 | ว.13 | TRUE | 2 |
| PAY003 | ยืม | TRUE | 3 |
```

Only active payment types should appear in the transaction form.

---

# 16. users Sheet

Columns:

```text
id
email
name
role
active
createdAt
```

Roles:

```text
admin
user
```

Suggested permissions:

### admin

- View transactions
- Create transactions
- Edit transactions
- Delete transactions
- Manage categories
- Manage payment types
- Manage users

### user

- View transactions
- Create transactions
- Edit transactions

Delete permission should be restricted unless explicitly allowed.

---

# 17. settings Sheet

Use this sheet for configurable system values.

Example:

```text
| key | value |
| startingBalance | 0 |
| currency | THB |
| timezone | Asia/Bangkok |
```

Do not hardcode values that may reasonably need to change.

---

# 18. REST API

Google Apps Script should expose a REST-like API.

## GET transactions

```text
GET /exec?action=transactions
```

Optional query parameters:

```text
type
categoryId
paymentTypeId
received
dateFrom
dateTo
search
```

Example:

```text
GET /exec?action=transactions&type=expense&dateFrom=2026-08-01&dateTo=2026-08-31
```

---

## GET transaction

```text
GET /exec?action=transaction&id=TX-001
```

---

## POST transaction

```text
POST /exec
```

Request body:

```json
{
  "action": "createTransaction",
  "data": {
    "date": "2026-08-21",
    "type": "expense",
    "operationDate": "21 สิงหาคม 69",
    "description": "ค่าเดินทาง",
    "categoryId": "CAT003",
    "amount": 500,
    "paymentTypeId": "PAY001",
    "received": false,
    "note": ""
  }
}
```

---

## PUT / update transaction

Google Apps Script does not require a literal HTTP PUT implementation.

Use POST with an action:

```text
POST /exec
```

```json
{
  "action": "updateTransaction",
  "id": "TX-001",
  "data": {
    "amount": 600,
    "description": "ค่าเดินทาง"
  }
}
```

---

## DELETE transaction

Use POST:

```json
{
  "action": "deleteTransaction",
  "id": "TX-001"
}
```

---

## GET categories

```text
GET /exec?action=categories
```

---

## GET payment types

```text
GET /exec?action=paymentTypes
```

---

# 19. API Response Format

Use a consistent response structure.

Success:

```json
{
  "success": true,
  "data": {},
  "message": "Success"
}
```

Error:

```json
{
  "success": false,
  "data": null,
  "message": "Transaction not found",
  "errorCode": "TRANSACTION_NOT_FOUND"
}
```

For lists:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "total": 100
  }
}
```

---

# 20. Backend Validation

Google Apps Script must validate all incoming data.

Do not trust frontend validation.

Validate:

- Required fields
- Transaction type
- Category ID
- Payment type ID
- Amount
- Date format
- Boolean values
- User permission

Amount must be:

```text
> 0
```

Do not allow negative transaction amounts.

Income/expense determines the sign.

---

# 21. Error Handling

Frontend must handle:

- Network errors
- API errors
- Validation errors
- Unauthorized access
- Empty results
- Google Apps Script errors
- Google Sheets errors

Show user-friendly Thai messages.

Example:

```text
ไม่สามารถโหลดข้อมูลได้
กรุณาลองใหม่อีกครั้ง
```

Do not expose raw stack traces to normal users.

---

# 22. Loading States

Every API operation must have a loading state.

Examples:

```text
กำลังโหลดข้อมูล...
กำลังบันทึก...
กำลังลบ...
```

Disable the submit button while saving to prevent duplicate submissions.

---

# 23. Notifications

Use toast notifications.

Examples:

```text
บันทึกรายการสำเร็จ
แก้ไขรายการสำเร็จ
ลบรายการสำเร็จ
เกิดข้อผิดพลาด กรุณาลองใหม่
```

---

# 24. UI / UX Requirements

The UI should be modern and clean but retain the usability of a spreadsheet.

Recommended layout:

```text
Sidebar
    Dashboard
    รายการทั้งหมด
    หมวดหมู่
    ประเภทเอกสาร
    ผู้ใช้งาน
    ตั้งค่า

Main Content
    Page title
    Summary cards
    Filters
    Transaction table
```

Use responsive design.

The application must work on:

- Desktop
- Tablet
- Mobile

Desktop is the primary target because the reference workflow is spreadsheet-based.

---

# 25. Transaction Table UX

Use:

- Sticky table header
- Horizontal scrolling on small screens
- Pagination
- Sortable columns where useful
- Empty state
- Loading skeleton
- Row actions
- Confirmation modal for delete

Example actions:

```text
ดู
แก้ไข
ลบ
```

---

# 26. Currency Formatting

Currency is Thai Baht.

Database:

```text
80000
```

UI:

```text
฿80,000.00
```

Use `Intl.NumberFormat` or an equivalent formatter.

Example:

```text
฿80,000.00
฿7,500.00
฿670.00
```

---

# 27. Date / Timezone

Use:

```text
Asia/Bangkok
```

Display dates in Thai-friendly format.

Database should use a stable format:

```text
YYYY-MM-DD
```

Datetime:

```text
ISO 8601
```

Example:

```text
2026-08-21T23:30:00+07:00
```

---

# 28. Authentication

Implement Google-based authentication if practical.

Allowed users should be controlled through the `users` sheet.

At minimum:

```text
email
role
active
```

Inactive users must not be able to use the application.

Do not expose Google Sheets credentials or Apps Script secrets in frontend source code.

---

# 29. Security Requirements

Important:

- Never expose Google service credentials in frontend.
- Never put private API keys in client-side code.
- Validate all requests in Apps Script.
- Validate user permissions on the backend.
- Sanitize input before writing to Google Sheets.
- Prevent formula injection in Google Sheets.

For user-provided strings, be careful with values beginning with:

```text
=
+
-
@
```

because they may be interpreted as spreadsheet formulas.

---

# 30. Google Apps Script Structure

Separate Apps Script logic into modules/files.

Suggested structure:

```text
apps-script/
├── Code.gs
├── Router.gs
├── TransactionService.gs
├── CategoryService.gs
├── PaymentTypeService.gs
├── UserService.gs
├── Validation.gs
├── Auth.gs
├── SheetRepository.gs
├── Utils.gs
└── Config.gs
```

Responsibilities:

### Code.gs

Entry points:

```text
doGet(e)
doPost(e)
```

### Router.gs

Routes requests by action.

### TransactionService.gs

Transaction business logic.

### SheetRepository.gs

Low-level Google Sheets read/write operations.

### Validation.gs

Input validation.

### Auth.gs

User authentication and authorization.

---

# 31. Frontend Project Structure

Use this structure:

```text
src/
├── components/
│   ├── layout/
│   ├── ui/
│   ├── transactions/
│   ├── dashboard/
│   └── common/
│
├── pages/
│   ├── DashboardPage.tsx
│   ├── TransactionsPage.tsx
│   ├── CategoriesPage.tsx
│   ├── PaymentTypesPage.tsx
│   ├── UsersPage.tsx
│   └── SettingsPage.tsx
│
├── hooks/
│   ├── useTransactions.ts
│   ├── useCategories.ts
│   └── usePaymentTypes.ts
│
├── services/
│   └── api.ts
│
├── types/
│   ├── transaction.ts
│   ├── category.ts
│   └── paymentType.ts
│
├── schemas/
│   └── transactionSchema.ts
│
├── utils/
│   ├── currency.ts
│   ├── date.ts
│   └── balance.ts
│
├── routes/
│   └── index.tsx
│
├── App.tsx
└── main.tsx
```

---

# 32. State Management

Use TanStack Query for server state.

Do not create unnecessary global state.

Use:

- TanStack Query for API data
- React Hook Form for forms
- Local React state for UI state

After mutation:

```text
create
  -> invalidate transactions query
  -> refetch

update
  -> invalidate transactions query
  -> refetch

delete
  -> invalidate transactions query
  -> refetch
```

---

# 33. Environment Variables

Frontend should use:

```text
VITE_API_BASE_URL
```

Example:

```text
VITE_API_BASE_URL=https://script.google.com/macros/s/xxxxx/exec
```

Do not hardcode the API URL throughout the source code.

---

# 34. Deployment

## Frontend

Deploy to Vercel.

Flow:

```text
GitHub
   |
   v
Vercel
   |
   v
Production
```

Configure:

```text
VITE_API_BASE_URL
```

in Vercel environment variables.

---

## Backend

Deploy Google Apps Script as a Web App.

Configuration:

```text
Execute as:
Me

Who has access:
Appropriate users / configured access
```

The exact access setting should be selected based on the authentication design.

---

# 35. CORS

The Google Apps Script API must be designed so the frontend can communicate with it from the Vercel domain.

Do not attempt to solve CORS by disabling browser security.

Test:

```text
Local development
Vercel preview
Vercel production
```

---

# 36. Performance

For the expected small-to-medium dataset:

- Fetch only required fields.
- Avoid unnecessary API calls.
- Cache master data.
- Use TanStack Query caching.
- Avoid reading the entire spreadsheet repeatedly for every small operation when possible.
- Batch Google Sheets operations where appropriate.

If the dataset becomes very large, migrate the database to PostgreSQL/Supabase instead of overengineering Google Sheets.

---

# 37. Audit Fields

Every transaction should contain:

```text
createdAt
updatedAt
createdBy
updatedBy
```

This will make it possible to determine who created or modified a record.

---

# 38. Initial Data

Create sample data based on the reference image.

Example:

```text
17/07/2026
รายรับ
เงินเรียนซ่อม
เงินโอนจาก รร.
80,000

03/08/2026
รายจ่าย
เขาใหญ่
ค่าเช่ารถ
7,500

03/08/2026
รายจ่าย
ชลบุรี
ค่าเช่ารถ
6,500

03/08/2026
รายจ่าย
ชลบุรี
ค่าเช่ารถ
6,500

04/08/2026
รายจ่าย
ศรราชกร ภคินี
ค่ายานพาหนะ
670

04/08/2026
รายจ่าย
สรรพร ภคินี
ค่ายานพาหนะ
110

05/08/2026
รายจ่าย
เทศบาลสีแดง ร้านค้าโรงเรียน
ค่าปรับปรุง
76

06/08/2026
รายจ่าย
เมืองธานี / วัดไพร
ค่าเช่ารถ
5,300

06/08/2026
รายจ่าย
สนามกีฬาปทุมธานี
ค่าเช่ารถ
3,300

06/08/2026
รายจ่าย
ศรีราชา
ค่าเช่ารถ
2,500

06/08/2026
รายจ่าย
ปทุมธานี
ค่าเช่ารถ
3,300

07/08/2026
รายจ่าย
เครื่องปรับอากาศ ม.1
ค่าซ่อม
1,605

10/08/2026
รายจ่าย
แจ้งวัฒนะ
ค่ายานพาหนะ
725

10/08/2026
รายจ่าย
ดอกไม้ถวายพระ วันแม่
ยืมกิจกรรมโรงเรียน
200
```

The sample data is only for development/demo purposes.

---

# 39. Important Business Rules

1. Every transaction has a unique ID.
2. Amount must always be positive.
3. Type determines whether amount is added or subtracted.
4. Balance must be calculated from ordered transactions.
5. Category must match the selected transaction type.
6. Only active master data appears in new transaction forms.
7. Delete requires confirmation.
8. Backend validates all input.
9. Frontend must never contain Google Sheets credentials.
10. Google Sheets is the source of truth.
11. Dashboard values are derived from transaction data.
12. Do not use spreadsheet row numbers as business IDs.

---

# 40. Testing Requirements

Create tests for:

## Balance

```text
starting = 80000
expense = 7500
result = 72500
```

```text
starting = 72500
expense = 6500
result = 66000
```

```text
starting = 66000
income = 10000
result = 76000
```

## Validation

Test:

- Missing date
- Missing type
- Missing description
- Missing category
- Amount = 0
- Negative amount
- Invalid category
- Invalid payment type
- Invalid transaction type

## CRUD

Test:

- Create transaction
- Get transaction
- Update transaction
- Delete transaction

---

# 41. Development Order

Build the project in this order.

## Phase 1

Create Google Spreadsheet structure.

```text
transactions
categories
payment_types
users
settings
```

## Phase 2

Create Google Apps Script API.

Implement:

```text
GET transactions
GET categories
GET payment types
POST transaction
POST updateTransaction
POST deleteTransaction
```

## Phase 3

Create React frontend.

Implement:

```text
Layout
Dashboard
Transaction table
```

## Phase 4

Implement:

```text
Create transaction
Edit transaction
Delete transaction
```

## Phase 5

Implement:

```text
Search
Filters
Pagination
```

## Phase 6

Implement:

```text
Authentication
Authorization
Admin pages
```

## Phase 7

Testing.

## Phase 8

Deploy to Vercel.

---

# 42. Coding Standards

Use:

- TypeScript strict mode.
- ESLint.
- Prettier.
- Clear naming.
- Small reusable components.
- Avoid duplicated business logic.
- Avoid `any` unless absolutely necessary.
- Keep API logic separate from UI components.
- Keep Google Apps Script data access separate from business logic.

Use async/await for asynchronous operations.

---

# 43. Definition of Done

The project is considered complete when:

- [x] React application runs locally.
- [x] Google Apps Script API runs correctly.
- [x] Google Sheets is used as the database.
- [x] Dashboard displays income, expense, and balance.
- [x] Transaction list displays correctly.
- [x] Create transaction works.
- [x] Edit transaction works.
- [x] Delete transaction works.
- [x] Search works.
- [x] Filters work.
- [x] Running balance is correct.
- [x] Category dropdown works.
- [x] Payment type dropdown works.
- [x] Validation works on frontend.
- [x] Validation works on backend.
- [x] Loading states exist.
- [x] Error handling exists.
- [x] Success/error toast notifications exist.
- [x] Responsive UI works.
- [x] No Google credentials are exposed in frontend.
- [x] Project can be deployed to Vercel.
- [x] Google Apps Script can be deployed as Web App.
- [x] README contains setup instructions.

---

# 44. Expected Deliverables

The AI implementing this project should produce:

```text
1. React + Vite + TypeScript frontend
2. Google Apps Script backend
3. Google Sheets schema
4. API implementation
5. CRUD functionality
6. Dashboard
7. Search/filter system
8. Authentication/authorization foundation
9. Tests
10. README
11. Deployment instructions
12. Example environment configuration
```

The implementation should be production-oriented, but avoid unnecessary complexity.

Prioritize a clean architecture that can later migrate from Google Sheets to PostgreSQL/Supabase without rewriting the entire frontend.

---

# 45. Final Architecture

```text
                         ┌──────────────────────┐
                         │       User           │
                         │    Web Browser       │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       Vercel         │
                         │                      │
                         │ React + Vite         │
                         │ TypeScript            │
                         │ Tailwind + shadcn/ui │
                         └──────────┬───────────┘
                                    │
                              HTTPS / REST
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ Google Apps Script   │
                         │                      │
                         │ API Router           │
                         │ Validation           │
                         │ Authentication      │
                         │ Business Logic       │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    Google Sheets     │
                         │                      │
                         │ transactions         │
                         │ categories           │
                         │ payment_types        │
                         │ users                │
                         │ settings             │
                         └──────────────────────┘
```

The first implementation should focus on the transaction CRUD flow and running balance before adding advanced features.
