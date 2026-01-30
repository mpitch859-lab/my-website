import { callApi } from "./api-client.js";

// ดึงตัวแปรจากหน้า HTML
const btnAnalyze = document.getElementById("btnAnalyze");
const monthInput = document.getElementById("monthSelect");
const analysisTable = document.getElementById("analysisTable");

if (btnAnalyze) {
    btnAnalyze.onclick = async () => {
    const m = monthInput.value;
    if (!m) return alert("กรุณาเลือกเดือน");

    try {
    analysisTable.innerHTML = "กำลังคำนวณข้อมูล...";
    const res = await callApi("analyze", { month: m });

    if (res.success) {
        const { income, expense, balance } = res.data;

      // ปรับ UI ให้แสดงผลตามรูปที่คุณต้องการ (ไม่มีกราฟ)
        analysisTable.innerHTML = `
        <div style="background:#fff; padding:20px; border-radius:8px; border:1px solid #ddd;">
            <h4 style="margin-top:0;">ประเภท จำนวน</h4>
            <p>รายรับ: <span style="color:green;">${income.toLocaleString()}</span></p>
            <p>รายจ่าย: <span style="color:red;">${expense.toLocaleString()}</span></p>
            <hr>
            <h4>ผลสรุปรายเดือน</h4>
            <p>รายรับ: ${income.toLocaleString()} บาท</p>
            <p>รายจ่าย: ${expense.toLocaleString()} บาท</p>
            <p>คงเหลือ: <b>${balance.toLocaleString()}</b> บาท</p>
            ${income === 0 && expense === 0 ? '<p style="color:red;">(ไม่มีข้อมูลสำหรับช่วงเวลานี้)</p>' : ''}
        </div>
        `;
    }
    } catch (e) {
    alert("เกิดข้อผิดพลาด: " + e.message);
    }
};
}