import { callApi } from "./api-client.js";

// ดึงตัวแปรจากหน้า HTML
const btnAnalyze = document.getElementById("btnAnalyze");
const monthInput = document.getElementById("monthSelect");
const analysisTable = document.getElementById("analysisTable"); // พื้นที่โชว์ตัวเลข
const chartEl = document.getElementById("chart");
let chartInstance = null;

if (btnAnalyze) {
    btnAnalyze.onclick = async () => {
    const m = monthInput.value; // ค่า YYYY-MM จากช่อง input
    if (!m) return alert("กรุณาเลือกเดือน");
    try {
      // แสดงสถานะกำลังคำนวณ
        analysisTable.innerHTML = "กำลังคำนวณยอดจากรายการทั้งหมด...";
      // เรียก API ไปที่ Code.gs
        const res = await callApi("analyze", { month: m });
        if (res.success) {
        const { income, expense, balance } = res.data;
        // 1. แสดงผลตัวเลขสรุป
        analysisTable.innerHTML = `
            <div style="padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
            <p style="color: green; font-size: 1.2em;">รายรับรวม: <b>฿${income.toLocaleString()}</b></p>
            <p style="color: red; font-size: 1.2em;">รายจ่ายรวม: <b>฿${expense.toLocaleString()}</b></p>
            <hr>
            <h3 style="margin: 10px 0;">ยอดคงเหลือ: ฿${balance.toLocaleString()}</h3>
            </div>
        `;
        // 2. วาดกราฟ Doughnut
        if (chartInstance) chartInstance.destroy(); // ลบกราฟเก่า
        if (income > 0 || expense > 0) {
            chartInstance = new Chart(chartEl.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['รายรับ', 'รายจ่าย'],
                datasets: [{
                data: [income, expense],
                backgroundColor: ['#28a745', '#dc3545'],
                borderWidth: 1
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
            });
        } else {
            analysisTable.innerHTML += "<p style='color: gray;'>* ไม่พบรายการเคลื่อนไหวในเดือนนี้</p>";
        }
        }
    } catch (e) {
        alert("เกิดข้อผิดพลาดในการคำนวณ: " + e.message);
    }
};
}