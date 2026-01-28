//api-client.js
import { callApi } from "./api-client.js";

const btnAnalyze = document.getElementById("btnAnalyze");
const monthInput = document.getElementById("monthSelect");
const analysisText = document.getElementById("analysisText");
const analysisTable = document.getElementById("analysisTable");
const chartEl = document.getElementById("chart");
let chartInstance = null;

// 1. ตั้งค่าเดือนปัจจุบันใน Input (เช่น 2026-01)
const now = new Date();
if (monthInput) {
    monthInput.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// 2. ฟังก์ชันวาดกราฟวงกลม
function renderChart(income, expense) {
    if (chartInstance) chartInstance.destroy();
    
    // ถ้าไม่มีข้อมูลเลย ให้แจ้งเตือนและไม่วาดกราฟ
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
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

// 3. ฟังก์ชันสร้างตารางสรุป
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
                <tr>
                    <td style="padding:8px;">รายจ่าย (Expense)</td>
                    <td style="text-align:right; padding:8px;" class="text-danger">${expense.toLocaleString()}</td>
                </tr>
                <tr style="background:#f9f9f9; font-weight:bold; border-top: 2px solid #eee;">
                    <td style="padding:8px;">คงเหลือสุทธิ</td>
                    <td style="text-align:right; padding:8px;">${(income - expense).toLocaleString()}</td>
                </tr>
            </tbody>
        </table>`;
}

// 4. เมื่อกดปุ่มวิเคราะห์
if (btnAnalyze) {
    btnAnalyze.addEventListener("click", async () => {
        const m = monthInput.value;
        const token = sessionStorage.getItem("session_token");
        if (!m) return alert("กรุณาเลือกเดือน");
        if (!token) {
            alert("กรุณาเข้าสู่ระบบใหม่");
            window.location.href = "login.html";
            return;
        }
        try {
            // ส่งค่าไปหา Code.gs (ส่งทั้ง token และ month)
            const res = await callApi("analyze", { token, month: m });
            
            if (res.success) {
                const { income, expense } = res.data;
                
                // อัปเดตข้อความสรุป
                analysisText.innerHTML = `
                    <div style="margin-top:15px;">
                        <b>ผลสรุปรายเดือน (${m})</b><br>
                        รายรับ: <span class="text-success">${income.toLocaleString()}</span> บาท<br>
                        รายจ่าย: <span class="text-danger">${expense.toLocaleString()}</span> บาท<br>
                        คงเหลือ: <b>${(income - expense).toLocaleString()}</b> บาท
                    </div>
                `;
                
                renderChart(income, expense);
                renderTable(income, expense);
            } else {
                alert("วิเคราะห์ไม่สำเร็จ: " + res.error);
            }
        } catch (e) {
            console.error(e);
            alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
        }
    });
}