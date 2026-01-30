import { callApi } from "./api-client.js";

// ดึง Element
const monthInput = document.getElementById("monthSelect");
const analysisTable = document.getElementById("analysisTable");

// 1. ฟังก์ชันสำหรับการดึงและแสดงผลข้อมูล
async function autoRefreshAnalysis() {
    const m = monthInput.value;
    if (!m) return;

    try {
        analysisTable.innerHTML = "กำลังดึงข้อมูลล่าสุด...";
        const res = await callApi("analyze", { month: m });

        if (res.success) {
            const { income, expense, balance } = res.data;
            
            // แสดงผลยอดรวมที่หน้าเว็บ
            analysisTable.innerHTML = `
                <div style="background:#fff; padding:20px; border-radius:8px; border:1px solid #ddd;">
                    <h3>ประเภท จำนวน</h3>
                    <p>รายรับ: <span style="color:green;">${income.toLocaleString()}</span></p>
                    <p>รายจ่าย: <span style="color:red;">${expense.toLocaleString()}</span></p>
                    <hr>
                    <h3>ผลสรุปรายเดือน</h3>
                    <p>รายรับ: ${income.toLocaleString()} บาท</p>
                    <p>รายจ่าย: ${expense.toLocaleString()} บาท</p>
                    <p>คงเหลือ: <b>${balance.toLocaleString()}</b> บาท</p>
                    ${income === 0 && expense === 0 ? '<p style="color:red;">(ไม่มีข้อมูลสำหรับช่วงเวลานี้)</p>' : ''}
                </div>
            `;
        }
    } catch (e) {
        console.error("Auto-fetch error:", e);
    }
}

// 2. สั่งให้ทำงานทันทีเมื่อโหลดหน้าเว็บ
document.addEventListener("DOMContentLoaded", () => {
    // ตั้งค่าเดือนปัจจุบันเป็นค่าเริ่มต้น
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    monthInput.value = currentMonth;

    // รันการดึงข้อมูลทันที
    autoRefreshAnalysis();
});

// 3. (แถม) ถ้า User เปลี่ยนเดือนในช่องเลือกเดือน ให้ดึงข้อมูลใหม่โดยอัตโนมัติ
monthInput.onchange = autoRefreshAnalysis;