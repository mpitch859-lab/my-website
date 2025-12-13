// js/analysis.js
import { callApi } from "./api-client.js";
const btnAnalyze = document.getElementById("btnAnalyze");
const btnAnalyzeWeek = document.getElementById("btnAnalyzeWeek");
const monthInput = document.getElementById("monthSelect");
const analysisText = document.getElementById("analysisText");
const analysisTable = document.getElementById("analysisTable");
const chartEl = document.getElementById("chart");
let chartInstance = null;
const now = new Date();
if (monthInput) monthInput.value = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
if (btnAnalyze) {
btnAnalyze.addEventListener("click", async () => {
    const m = monthInput.value;
    if (!m) return alert("เลือกเดือนก่อน");
    try {
    const res = await callApi("analyze", { month: m });
    const { income, expense } = res.data;
    analysisText.innerHTML = `รายรับ: ${income} บาท<br>รายจ่าย: ${expense} บาท<br>คงเหลือ: ${income - expense} บาท`;
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(chartEl.getContext('2d'), {
        type: 'pie',
        data: { labels: ['รายรับ','รายจ่าย'], datasets: [{ data: [income, expense] }] }
    });
      // table (simple)
    analysisTable.innerHTML = `<table><tr><th>ประเภท</th><th>จำนวน</th></tr><tr><td>รายรับ</td><td>${income}</td></tr><tr><td>รายจ่าย</td><td>${expense}</td></tr></table>`;
    } catch (e) { alert(e.message); }
});
}
if (btnAnalyzeWeek) {
btnAnalyzeWeek.addEventListener("click", async () => {
    const m = monthInput.value;
    if (!m) return alert("เลือกเดือนก่อน");
    const [y, mm] = m.split("-");
    try {
    const res = await callApi("analyzeWeek", { year: y, month: mm, day: 1 });
    const d = res.data;
    analysisText.innerHTML = `สัปดาห์: ${d.weekStart.slice(0,10)} ถึง ${d.weekEnd.slice(0,10)}<br>รายรับ: ${d.income} บาท<br>รายจ่าย: ${d.expense} บาท`;
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(chartEl.getContext('2d'), {
        type: 'pie',
        data: { labels: ['รายรับ','รายจ่าย'], datasets: [{ data: [d.income, d.expense] }] }
    });
    analysisTable.innerHTML = `<table><tr><th>ประเภท</th><th>จำนวน</th></tr><tr><td>รายรับ</td><td>${d.income}</td></tr><tr><td>รายจ่าย</td><td>${d.expense}</td></tr></table>`;
    } catch (e) { alert(e.message); }
});
}