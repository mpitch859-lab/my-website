import { callApi } from "./api-client.js";

const btnAnalyze = document.getElementById("btnAnalyze");
const monthInput = document.getElementById("monthSelect");
const analysisText = document.getElementById("analysisText");
const analysisTable = document.getElementById("analysisTable");
const chartEl = document.getElementById("chart");
let chartInstance = null;

// ตั้งค่าเดือนปัจจุบันใน Input
const now = new Date();
if (monthInput) {
    monthInput.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// ฟังก์ชันวาดกราฟ
function renderChart(income, expense) {
    if (chartInstance) chartInstance.destroy();
    if (income === 0 && expense === 0) {
        analysisText.innerHTML += "<br><small style='color:red'>(ไม่มีข้อมูลสำหรับเดือนนี้)</small>";
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
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

// วิเคราะห์รายเดือนอย่างเดียว
if (btnAnalyze) {
    btnAnalyze.addEventListener("click", async () => {
        const m = monthInput.value;
        if (!m) return alert("กรุณาเลือกเดือน");
        const token = sessionStorage.getItem("session_token"); // ดึง Token มายืนยันตัวตน
        const res = await callApi("analyze", { token, month: m });
        if (!token) return window.location.href = "login.html";
        try {
            // ส่ง Action "analyze" พร้อม token และเดือน
            const res = await callApi("analyze", { token, month: m });
            
            if (res.success) {
                const { income, expense } = res.data;
                
                // แสดงข้อความสรุป
                analysisText.innerHTML = `
                    <div style="margin-top:15px;">
                        <b>ผลสรุปรายเดือน</b><br>
                        รายรับ: <span class="text-success">${income.toLocaleString()}</span> บาท<br>
                        รายจ่าย: <span class="text-danger">${expense.toLocaleString()}</span> บาท<br>
                        คงเหลือ: <b>${(income - expense).toLocaleString()}</b> บาท
                    </div>
                `;
                
                // วาดกราฟและตาราง
                renderChart(income, expense);
                renderTable(income, expense);
            } else {
                alert("เกิดข้อผิดพลาด: " + res.error);
            }
        } catch (e) {
            alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
        }
    });
}

// ฟังก์ชันสร้างตารางสรุป
function renderTable(income, expense) {
    analysisTable.innerHTML = `
        <table class="table" style="width:100%; margin-top:20px; border-collapse: collapse;">
            <thead>
                <tr style="border-bottom: 2px solid #ddd;">
                    <th style="text-align:left; padding:8px;">ประเภท</th>
                    <th style="text-align:right; padding:8px;">จำนวนเงิน</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="padding:8px;">รายรับ (Income)</td>
                    <td style="text-align:right; padding:8px;" class="text-success">${income.toLocaleString()}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding:8px;">รายจ่าย (Expense)</td>
                    <td style="text-align:right; padding:8px;" class="text-danger">${expense.toLocaleString()}</td>
                </tr>
                <tr style="background:#f9f9f9; font-weight:bold;">
                    <td style="padding:8px;">คงเหลือสุทธิ</td>
                    <td style="text-align:right; padding:8px;">${(income - expense).toLocaleString()}</td>
                </tr>
            </tbody>
        </table>`;
}