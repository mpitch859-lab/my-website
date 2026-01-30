import { callApi } from "./api-client.js";

const monthInput = document.getElementById("monthSelect");
const analysisTable = document.getElementById("analysisTable");

// วางฟังก์ชันนี้ใน analysis.js
async function autoRefreshAnalysis() {
    const m = monthInput.value;
    if (!m) return;

    try {
        // แสดงสถานะกำลังโหลดบนหน้าเว็บ
        analysisTable.innerHTML = `<div style="text-align:center; padding:20px;">
                                        <p>กำลังดึงข้อมูลเดือน ${m}...</p>
                                    </div>`;
        
        // ส่งข้อมูลไปให้ Code.gs ประมวลผล
        const res = await callApi("analyze", { month: m });

        if (res.success) {
            const { income, expense, balance } = res.data;
            
            // นำยอดที่ Code.gs ส่งกลับมา แสดงผลบนหน้าเว็บ
            analysisTable.innerHTML = `
                <div class="result-card">
                    <p>รายรับ: <span style="color:green;">${income.toLocaleString()}</span></p>
                    <p>รายจ่าย: <span style="color:red;">${expense.toLocaleString()}</span></p>
                    <p>คงเหลือ: <b>${balance.toLocaleString()}</b></p>
                </div>
            `;
        }
    } catch (e) {
        console.error("Error:", e);
        analysisTable.innerHTML = "<p style='color:red;'>เกิดข้อผิดพลาดในการโหลดข้อมูล</p>";
    }
}

// สั่งให้ทำงานเมื่อโหลดหน้า และเมื่อเปลี่ยนเดือน
document.addEventListener("DOMContentLoaded", () => {
    // ... code ตั้งค่าวันที่ปัจจุบัน ...
    autoRefreshAnalysis();
});
monthInput.onchange = autoRefreshAnalysis;