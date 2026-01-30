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
        analysisTable.innerHTML = "กำลังคำนวณยอด...";

        const res = await callApi("analyze", { month: m });

        if (res.success) {
        const { income, expense, balance } = res.data;

        // แสดงเฉพาะข้อมูลตัวเลขรายรับ รายจ่าย และยอดคงเหลือ
        analysisTable.innerHTML = `
            <div style="margin-top: 20px; padding: 20px; border-radius: 10px; background-color: #f8f9fa; border: 1px solid #dee2e6;">
            <h4 style="margin-bottom: 15px; text-align: center;">สรุปยอดเดือน ${m}</h4>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>รายรับรวม:</span>
                <span style="color: green; font-weight: bold;">+ ฿${income.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>รายจ่ายรวม:</span>
                <span style="color: red; font-weight: bold;">- ฿${expense.toLocaleString()}</span>
            </div>
            <hr style="border-top: 2px solid #ddd;">
            <div style="display: flex; justify-content: space-between; font-size: 1.2em; font-weight: bold;">
                <span>ยอดคงเหลือสุทธิ:</span>
                <span style="color: ${balance >= 0 ? '#28a745' : '#dc3545'};">
                ฿${balance.toLocaleString()}
                </span>
            </div>
            </div>
        `;
        }
    } catch (e) {
        alert("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
    };
}