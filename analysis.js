// analysis.js
import { callApi } from "./api-client.js";

const monthInput = document.getElementById("monthSelect");
const analysisTable = document.getElementById("analysisTable");
const analysisText = document.getElementById("analysisText");
const btnAnalyze = document.getElementById("btnAnalyze");

async function autoRefreshAnalysis() {
    const m = monthInput.value;
    if (!m) return;

    try {
        analysisTable.innerHTML = `
            <div style="text-align:center; padding:20px;">
                <p>กำลังดึงข้อมูลเดือน ${m}...</p>
            </div>
        `;
        analysisText.textContent = "";

        const res = await callApi("analyze", { month: m });
        console.log("Analyze response:", res);

        if (!res.success) {
            analysisTable.innerHTML =
                `<p style="color:red;">${res.error}</p>`;
            return;
        }

        const { income, expense, balance } = res.data;

        analysisText.innerHTML = `
            <strong>ผลสรุปเดือน ${m}</strong>
        `;

        analysisTable.innerHTML = `
            <table style="width:100%; border-collapse:collapse;">
                <tr>
                    <th style="text-align:left; padding:8px;">ประเภท</th>
                    <th style="text-align:right; padding:8px;">จำนวนเงิน (บาท)</th>
                </tr>
                <tr>
                    <td style="padding:8px;">รายรับ</td>
                    <td style="padding:8px; text-align:right; color:green;">
                        ${income.toLocaleString()}
                    </td>
                </tr>
                <tr>
                    <td style="padding:8px;">รายจ่าย</td>
                    <td style="padding:8px; text-align:right; color:red;">
                        ${expense.toLocaleString()}
                    </td>
                </tr>
                <tr>
                    <td style="padding:8px;"><strong>คงเหลือ</strong></td>
                    <td style="padding:8px; text-align:right;">
                        <strong>${balance.toLocaleString()}</strong>
                    </td>
                </tr>
            </table>
        `;
    } catch (e) {
        console.error("Error:", e);
        analysisTable.innerHTML =
            "<p style='color:red;'>เกิดข้อผิดพลาดในการโหลดข้อมูล</p>";
    }
}

/* ===== init ===== */
document.addEventListener("DOMContentLoaded", () => {
    // ตั้งค่าเดือนปัจจุบัน
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    monthInput.value = ym;

    autoRefreshAnalysis();
});

// event
monthInput.onchange = autoRefreshAnalysis;
btnAnalyze.onclick = autoRefreshAnalysis;
