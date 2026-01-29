// analysis.js
import { callApi } from "./api-client.js";

const btnAnalyze = document.getElementById("btnAnalyze");
const monthInput = document.getElementById("monthSelect");
const analysisText = document.getElementById("analysisText");
const analysisTable = document.getElementById("analysisTable");
const chartEl = document.getElementById("chart");
let chartInstance = null;

// 1. ตั้งค่าเดือนปัจจุบัน
const now = new Date();
if (monthInput) {
    monthInput.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// 2. ฟังก์ชันวาดกราฟ
function renderChart(income, expense) {
    if (chartInstance) chartInstance.destroy();
    if (income === 0 && expense === 0) {
        analysisText.innerHTML += "<br><small style='color:red'>(ไม่พบข้อมูลในเดือนที่เลือก)</small>";
        return;
    }
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
}

// 3. ฟังก์ชันสร้างตาราง
function renderTable(income, expense) {
    analysisTable.innerHTML = `
        <table class="table" style="width:100%; margin-top:20px; border-collapse: collapse;">
            <thead><tr style="border-bottom: 2px solid #ddd;"><th style="text-align:left;">ประเภท</th><th style="text-align:right;">จำนวนเงิน</th></tr></thead>
            <tbody>
                <tr><td>รายรับ</td><td style="text-align:right;" class="text-success">${income.toLocaleString()}</td></tr>
                <tr><td>รายจ่าย</td><td style="text-align:right;" class="text-danger">${expense.toLocaleString()}</td></tr>
                <tr style="background:#f9f9f9; font-weight:bold;"><td>คงเหลือสุทธิ</td><td style="text-align:right;">${(income - expense).toLocaleString()}</td></tr>
            </tbody>
        </table>`;
}

// 4. เมื่อกดปุ่มวิเคราะห์
if (btnAnalyze) {
    console.log("ปุ่มวิเคราะห์พร้อมทำงาน");
    btnAnalyze.addEventListener("click", async () => {
        const m = monthInput.value;
        const token = sessionStorage.getItem("session_token");

        if (!m) return alert("กรุณาเลือกเดือน");
        if (!token) return (window.location.href = "login.html");

        try {
            console.log("ส่งคำขอวิเคราะห์ไปที่ Google Sheets...");
            // ส่งค่าไปหา Code.gs (ตัวแปร 'd' ใน Code.gs จะได้รับค่า 'month')
            const res = await callApi("analyze", { month: m });
            
            console.log("ผลลัพธ์จาก Server:", res);

            if (res && res.success) {
                const { income, expense } = res.data;
                
                analysisText.innerHTML = `<b>ผลสรุปรายเดือน (${m})</b>`;
                renderChart(income, expense);
                renderTable(income, expense);
            } else {
                alert("วิเคราะห์ไม่สำเร็จ: " + (res.error || "Unknown Error"));
            }
        } catch (e) {
            console.error("API Call Failed:", e);
            alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ ตรวจสอบ URL ใน config.js");
        }
    });
}