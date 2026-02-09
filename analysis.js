// analysis.js
import { callApi, showNotify } from "./api-client.js";

const monthInput = document.getElementById("monthSelect");
const analysisTable = document.getElementById("analysisTable");
const analysisText = document.getElementById("analysisText");
const btnAnalyze = document.getElementById("btnAnalyze");

let chartInstance = null;
let currentType = 'bar';
let globalData = { income: 0, expense: 0, categories: {} };

function renderChart(type) {
    const ctx = document.getElementById('myChart').getContext('2d');
    if (chartInstance) chartInstance.destroy();

    const config = type === 'bar' ? {
        type: 'bar',
        data: {
            labels: ['รายรับ', 'รายจ่าย'],
            datasets: [{
                label: 'บาท',
                data: [globalData.income, globalData.expense],
                backgroundColor: ['#28a745', '#dc3545']
            }]
        }
    } : {
        type: 'pie',
        data: {
            labels: Object.keys(globalData.categories),
            datasets: [{
                data: Object.values(globalData.categories),
                backgroundColor: ['#007bff', '#6610f2', '#6f42c1', '#e83e8c', '#fd7e14', '#ffc107']
            }]
        }
    };
    chartInstance = new Chart(ctx, config);
}

async function autoRefreshAnalysis() {
    const m = monthInput.value;
    if (!m) return;

    try {
        analysisTable.innerHTML = `<p style="text-align:center;">กำลังดึงข้อมูล...</p>`;
        
        const [resAnalyze, resSummary] = await Promise.all([
            callApi("analyze", { month: m }),
            callApi("getSummary")
        ]);

        if (resAnalyze.success && resSummary.success) {
            globalData.income = resAnalyze.data.income;
            globalData.expense = resAnalyze.data.expense;
            globalData.categories = resSummary.data.categories;

            analysisText.innerHTML = `<strong>สรุปยอดเดือน ${m}</strong>`;
            
            analysisTable.innerHTML = `
                <table style="width:100%; border-collapse:collapse; margin-top:15px;">
                    <tr style="border-bottom:1px solid #eee;">
                        <th style="text-align:left; padding:8px;">ประเภท</th>
                        <th style="text-align:right; padding:8px;">จำนวนเงิน</th>
                    </tr>
                    <tr><td>รายรับ</td><td style="text-align:right; color:green;">${globalData.income.toLocaleString()}</td></tr>
                    <tr><td>รายจ่าย</td><td style="text-align:right; color:red;">${globalData.expense.toLocaleString()}</td></tr>
                    <tr style="background:#f0f7ff;">
                        <td><strong>คงเหลือ</strong></td>
                        <td style="text-align:right;"><strong>${(globalData.income - globalData.expense).toLocaleString()}</strong></td>
                    </tr>
                </table>`;
            
            renderChart(currentType);
        }
    } catch (e) {
        showNotify('ผิดพลาด', 'ไม่สามารถเชื่อมต่อข้อมูลได้', 'error');
    }
}

document.getElementById('btnToggleChart').addEventListener('click', (e) => {
    currentType = currentType === 'bar' ? 'pie' : 'bar';
    e.target.innerText = currentType === 'bar' ? 'สลับเป็นกราฟวงกลม' : 'สลับเป็นกราฟแท่ง';
    renderChart(currentType);
});

document.addEventListener("DOMContentLoaded", () => {
    const now = new Date();
    monthInput.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    autoRefreshAnalysis();
});

monthInput.onchange = autoRefreshAnalysis;
btnAnalyze.onclick = autoRefreshAnalysis;