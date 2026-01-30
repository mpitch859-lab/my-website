import { callApi } from "./api-client.js";

const monthInput = document.getElementById("monthSelect");
const analysisTable = document.getElementById("analysisTable");

async function autoRefreshAnalysis() {
    const m = monthInput.value;
    if (!m) return;
    try {
        analysisTable.innerHTML = `<div style="text-align:center; padding:20px;">
                                        <p>กำลังดึงข้อมูลเดือน ${m}...</p>
                                    </div>`;
        const token = localStorage.getItem("token");
        const res = await callApi("analyze", {
        token,
        month: m
    });
    console.log("Analyze response:", res);
    if (!res.success) {
        console.error("Analyze error:", res.error, res.stack);
        analysisTable.innerHTML =
            `<p style="color:red;">${res.error}</p>`;
        return;
    }
    const { income, expense, balance } = res.data;
    } catch (e) {
        console.error("Error:", e);
        analysisTable.innerHTML = "<p style='color:red;'>เกิดข้อผิดพลาดในการโหลดข้อมูล</p>";
    }
}

// สั่งให้ทำงานเมื่อโหลดหน้า และเมื่อเปลี่ยนเดือน
document.addEventListener("DOMContentLoaded", () => {
    // ... code ตั้งค่าวันที่ปัจจุบัน ...
    autoRefreshAnalysis();
});
monthInput.onchange = autoRefreshAnalysis;