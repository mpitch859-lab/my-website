// auth.js
import { callApi, showNotify } from "./api-client.js";

/* ---------- REGISTER ---------- */
document.getElementById("btnRegister")?.addEventListener("click", async () => {
  const email = document.getElementById("regEmail")?.value.trim();
  const password = document.getElementById("regPassword")?.value;

  if (!email || !password) {
    showNotify('แจ้งเตือน', 'กรุณากรอกข้อมูลให้ครบ', 'warning');
    return;
  }

  const res = await callApi("register", { email, password });

  if (res.success) {
    showNotify('สำเร็จ', 'สมัครสำเร็จ', 'success');
    location.href = "login.html";
  } else {
    showNotify('ผิดพลาด', res.error || "สมัครไม่สำเร็จ", 'error');
  }
});

/* ---------- LOGIN ---------- */
document.getElementById("btnLogin")?.addEventListener("click", async () => {
  const email = document.getElementById("loginEmail")?.value.trim();
  const password = document.getElementById("loginPassword")?.value;

  if (!email || !password) {
    showNotify('แจ้งเตือน', 'กรุณากรอกข้อมูลให้ครบ', 'warning');
    return;
  }
const res = await callApi("login", { email, password });
if (res.success && res.data) {
  sessionStorage.setItem("session_token", res.data.token);
  location.href = "record.html";
} else {
  showNotify('ผิดพลาด', res.error || "อีเมลหรือรหัสผ่านไม่ถูกต้อง", 'error');
}
});

/* ---------- LOGOUT ---------- */
document.getElementById("btnLogout")?.addEventListener("click", () => {
  sessionStorage.clear();
  location.href = "login.html";
});

/* ---------- PROTECT PAGE ---------- */
const protectedPages = ["record.html", "analysis.html", "calendar.html"];
const page = location.pathname.split("/").pop();

if (
  protectedPages.includes(page) &&
  !sessionStorage.getItem("session_token")
) {
  location.href = "login.html";
}