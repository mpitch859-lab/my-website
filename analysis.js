import { callApi } from "./api-client.js";

// ดึงตัวแปรจากหน้า HTML
const btnAnalyze = document.getElementById("btnAnalyze");
const monthInput = document.getElementById("monthSelect");
const analysisTable = document.getElementById("analysisTable");

if (btnAnalyze) {
    // ฟังก์ชันเมื่อกดปุ่มวิเคราะห์
btnAnalyze.onclick = async () => {
  const m = monthInput.value; // รับค่าจากช่องเลือกเดือน
    if (!m) return alert("กรุณาเลือกเดือน");

    try {
    // เรียก API (ผ่านระบบ api-client ที่คุณมี)
    const res = await callApi("analyze", { month: m });

    if (res.success) {
        const { income, expense, balance } = res.data;

      // นำข้อมูลไปโชว์ใน div ที่เตรียมไว้ (อ้างอิงรูปแบบจากภาพของคุณ)
        document.getElementById("analysisTable").innerHTML = `
        <div class="result-card">
            <h3>ประเภท จำนวน</h3>
            <p>รายรับ: <span style="color:green;">${income.toLocaleString()}</span></p>
            <p>รายจ่าย: <span style="color:red;">${expense.toLocaleString()}</span></p>
            <hr>
            <h3>ผลสรุปรายเดือน</h3>
            <p>รายรับ: ${income.toLocaleString()} บาท</p>
            <p>รายจ่าย: ${expense.toLocaleString()} บาท</p>
            <p>คงเหลือ: <b>${balance.toLocaleString()}</b> บาท</p>
        </div>
        `;
    }
    } catch (e) {
    console.error("Error:", e);
    alert("ดึงข้อมูลไม่สำเร็จ");
    }
};
}