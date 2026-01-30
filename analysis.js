import { callApi } from "./api-client.js";

const btnAnalyze = document.getElementById("btnAnalyze");
const monthInput = document.getElementById("monthSelect");
const resultDiv = document.getElementById("analysisTable"); // หรือจุดที่คุณจะโชว์ตัวเลข
const chartEl = document.getElementById("chart");
let chartInstance = null; // สร้างตัวแปรไว้เก็บสถานะกราฟ

if (btnAnalyze) {
    btnAnalyze.onclick = async () => {
    // 1. ตรวจสอบความพร้อม
    console.log("ปุ่มถูกกดแล้ว!"); // เพิ่มบรรทัดนี้
    const m = monthInput.value;
    console.log("เดือนที่เลือกคือ:", m);
    if (!m) return alert("กรุณาเลือกเดือน");
    try {
      // 2. เรียกข้อมูลจาก Google Sheets
        const res = await callApi("analyze", { month: m });
        if (res.success) {
        const { income, expense, balance } = res.data;
        // 3. แสดงผลตัวเลข (สรุปยอด)
        resultDiv.innerHTML = `
            <div style="margin-top:20px; border-top:1px solid #eee; padding-top:15px;">
            <p style="color:#28a745">รายรับ: ฿${income.toLocaleString()}</p>
            <p style="color:#dc3545">รายจ่าย: ฿${expense.toLocaleString()}</p>
            <hr>
            <p><b>ยอดคงเหลือ: ฿${balance.toLocaleString()}</b></p>
            /div>
        `;
        // 4. วาดกราฟ (และลบตัวเก่าทิ้งก่อนเพื่อป้องกันกราฟค้าง)
        if (chartInstance) chartInstance.destroy();
        chartInstance = new Chart(chartEl.getContext('2d'), {
            type: 'doughnut',
            data: {
            labels: ['รายรับ', 'รายจ่าย'],
            datasets: [{
                data: [income, expense],
                backgroundColor: ['#28a745', '#dc3545']
            }]
        },
            options: { responsive: true, maintainAspectRatio: false }
        });
    } else {
        alert("ผิดพลาด: " + res.error);
    }
    } catch (e) {
        alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    }
};
}