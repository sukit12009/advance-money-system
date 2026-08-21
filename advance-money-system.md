# Advance Money System

## ภาพรวม

ระบบบันทึกเงินยืมรองจ่ายแบบ HTML ไฟล์เดียว

## ฟิลด์

-   ลำดับ
-   รายการ
-   รายรับ
-   รายจ่าย
-   หมวด
-   จำนวนเงิน
-   วันที่โอน
-   ผู้รับเงิน
-   Note

## คุณสมบัติ

-   เพิ่ม/แก้ไข/ลบ
-   ค้นหา
-   LocalStorage
-   Backup เป็น JSON
-   Restore จาก JSON

## โครงสร้างไฟล์

``` text
index.html
```

## ตัวอย่างโครงสร้างข้อมูล

``` json
{
  "id":1,
  "title":"ซื้อวัสดุ",
  "income":0,
  "expense":1200,
  "category":"วัสดุ",
  "amount":1200,
  "transferDate":"2026-08-03",
  "receiver":"นาย ก",
  "note":"..."
}
```

## index.html (Skeleton)

``` html
<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Advance Money</title>
<style>
body{font-family:Arial,sans-serif;margin:20px}
table{width:100%;border-collapse:collapse}
th,td{border:1px solid #ccc;padding:8px}
</style>
</head>
<body>
<h1>ระบบบันทึกเงินยืมรองจ่าย</h1>
<!-- ฟอร์มและตาราง -->
<script>
// TODO:
// - CRUD
// - LocalStorage
// - Backup
// - Restore
</script>
</body>
</html>
```

## Backup

กดปุ่ม Backup แล้วดาวน์โหลดข้อมูลเป็น `backup.json`

## Restore

กดปุ่ม Restore แล้วเลือกไฟล์ `backup.json`
