// auth.js
import { callApi } from "./api-client.js";

/* ---------- REGISTER ---------- */
document.getElementById("btnRegister")?.addEventListener("click", async () => {
  const email = document.getElementById("regEmail")?.value.trim();
  const password = document.getElementById("regPassword")?.value;

  if (!email || !password) {
    alert("กรุณากรอกข้อมูลให้ครบ");
    return;
  }

  const res = await callApi("register", { email, password });

  // เช็ค res.success จาก GAS
  if (res.success) {
    alert("สมัครสำเร็จ");
    location.href = "login.html";
  } else {
    // แสดง error message จาก err.message ใน GAS
    alert(res.error || "สมัครไม่สำเร็จ");
  }
});

/* ---------- LOGIN ---------- */
document.getElementById("btnLogin")?.addEventListener("click", async () => {
  const email = document.getElementById("loginEmail")?.value.trim();
  const password = document.getElementById("loginPassword")?.value;

  if (!email || !password) {
    alert("กรุณากรอกข้อมูลให้ครบ");
    return;
  }

  const res = await callApi("login", { email, password });

  if (res.success && res.data) {
    // ⚠️ ต้องดึงจาก res.data.token ตามที่ GAS ส่งมา
    sessionStorage.setItem("session_token", res.data.token);
    location.href = "record.html";
  } else {
    alert(res.error || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
  }
});

// ... ส่วนที่เหลือ (Logout / Protect Page) ใช้ของเดิมได้เลยครับ ...