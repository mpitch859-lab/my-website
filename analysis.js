// js/analysis.js
import { callApi } from "./api-client.js";

const btnAnalyze = document.getElementById("btnAnalyze");
const btnAnalyzeWeek = document.getElementById("btnAnalyzeWeek");
const monthInput = document.getElementById("monthSelect");
const analysisText = document.getElementById("analysisText");
const analysisTable = document.getElementById("analysisTable");
const chartEl = document.getElementById("chart");
let chartInstance = null;

// ตั้งค่าเดือนปัจจุบันใน Input
const now = new Date();
if (monthInput) monthInput.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

// ฟังก์ชันวาดกราฟ (Reusable)
function renderChart(income, expense) {
    if (chartInstance) chartInstance.destroy();
    if (income === 0 && expense === 0) {
        analysisText.innerHTML += "<br><small style='color:red'>(ไม่มีข้อมูลสำหรับช่วงเวลานี้)</small>";
        return;
    }
    chartInstance = new Chart(chartEl.getContext('2d'), {
        type: 'doughnut', // เปลี่ยนเป็นโดนัทจะดูทันสมัยกว่า
        data: {
            labels: ['รายรับ', 'รายจ่าย'],
            datasets: [{
                data: [income, expense],
                backgroundColor: ['#28a745', '#dc3545']
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// วิเคราะห์รายเดือน
if (btnAnalyze) {
    btnAnalyze.addEventListener("click", async () => {
        const m = monthInput.value;
        if (!m) return alert("กรุณาเลือกเดือน");
        try {
            const res = await callApi("analyze", { month: m });
            const { income, expense } = res.data;
            
            analysisText.innerHTML = `
                <b>ผลสรุปรายเดือน</b><br>
                รายรับ: <span class="text-success">${income.toLocaleString()}</span> บาท<br>
                รายจ่าย: <span class="text-danger">${expense.toLocaleString()}</span> บาท<br>
                คงเหลือ: <b>${(income - expense).toLocaleString()}</b> บาท
            `;
            
            renderChart(income, expense);
            analysisTable.innerHTML = `
                <table class="table">
                    <thead><tr><th>ประเภท</th><th>จำนวน</th></tr></thead>
                    <tbody>
                        <tr><td>รายรับ</td><td class="text-success">${income.toLocaleString()}</td></tr>
                        <tr><td>รายจ่าย</td><td class="text-danger">${expense.toLocaleString()}</td></tr>
                    </tbody>
                </table>`;
        } catch (e) { alert("เกิดข้อผิดพลาด: " + e.message); }
    });
}

// วิเคราะห์รายสัปดาห์
if (btnAnalyzeWeek) {
    btnAnalyzeWeek.addEventListener("click", async () => {
        const m = monthInput.value;
        const [y, mm] = m.split("-");
        try {
            const res = await callApi("analyzeWeek", { year: parseInt(y), month: parseInt(mm), day: 1 });
            const d = res.data;
            
            analysisText.innerHTML = `
                <b>ผลสรุปสัปดาห์นี้</b><br>
                <small>${new Date(d.weekStart).toLocaleDateString('th-TH')} - ${new Date(d.weekEnd).toLocaleDateString('th-TH')}</small><br>
                รายรับ: ${d.income.toLocaleString()} บาท | รายจ่าย: ${d.expense.toLocaleString()} บาท
            `;
            
            renderChart(d.income, d.expense);
        } catch (e) { alert(e.message); }
    });
}