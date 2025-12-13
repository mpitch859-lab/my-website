// js/auth.js
import { WEB_APP_URL } from "./config.js";
async function call(action, payload = {}, token = null) {
  const body = { action, payload };
  if (token) body.token = token;
  await fetch(WEB_APP_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
  });
  return { ok: true };
}
/* ---------- REGISTER (on register.html) ---------- */
const btnRegister = document.getElementById("btnRegister");
if (btnRegister) {
  btnRegister.addEventListener("click", async () => {
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;
    if (!email || !password) return alert("กรุณากรอกข้อมูลให้ครบ");
    if (password.length < 6) return alert("รหัสผ่านอย่างน้อย 6 ตัว");
    try {
      const r = await call("register", { email, password })
      if (r.error) return alert(r.error);
      alert("สมัครสมาชิกสำเร็จ โปรดเข้าสู่ระบบ");
      window.location = "login.html";
    } catch (e) {
      alert("เกิดข้อผิดพลาด: " + e.message);
    }
  });
}
/* ---------- LOGIN (on login.html) ---------- */
const btnLogin = document.getElementById("btnLogin");
if (btnLogin) {
  btnLogin.addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    if (!email || !password) return alert("กรุณากรอกข้อมูลให้ครบ");
    try {
      const r = await call("login", { email, password });
      if (r.error) return alert(r.error);
      // r.data contains token, expiresAt, userId, name
      sessionStorage.setItem("session_token", r.data.token);
      sessionStorage.setItem("userId", r.data.userId);
      sessionStorage.setItem("userName", r.data.name || "");
      window.location = "record.html";
    } catch (e) { alert("เกิดข้อผิดพลาด: " + e.message); }
  });
}
/* ---------- LOGOUT (same page protected) ---------- */
const btnLogout = document.getElementById("btnLogout");
if (btnLogout) {
  btnLogout.addEventListener("click", async () => {
    const token = sessionStorage.getItem("session_token");
    if (token) {
      await call("logout", {}, token);
    }
    sessionStorage.removeItem("session_token");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userName");
    window.location = "login.html";
  });
}
/* ---------- PROTECT PAGES (client-side) ---------- */
const protectedPages = ["record.html", "analysis.html", "calendar.html"];
const path = window.location.pathname.split("/").pop();
if (protectedPages.includes(path)) {
  const token = sessionStorage.getItem("session_token");
  if (!token) {
    window.location = "login.html";
  } else {
    // optionally show user's name in UI
    const nameEl = document.getElementById("displayName");
    if (nameEl) nameEl.textContent = sessionStorage.getItem("userName") || "";
  }
}
/* ---------- FORGOT PASSWORD (forgot.html) ---------- */
const btnForgot = document.getElementById("btnForgot");
if (btnForgot) {
  btnForgot.addEventListener("click", async () => {
    const email = document.getElementById("forgotEmail").value.trim();
    if (!email) return alert("กรุณากรอกอีเมล");
    try {
      const r = await call("forgotPassword", { email });
      if (r.error) return alert(r.error);
      alert("ส่งโค้ดรีเซ็ตไปที่อีเมลแล้ว (ตรวจสอบกล่องจดหมาย)");
      window.location = "reset.html";
    } catch (e) { alert("เกิดข้อผิดพลาด: " + e.message); }
  });
}
/* ---------- RESET PASSWORD (reset.html) ---------- */
const btnReset = document.getElementById("btnReset");
if (btnReset) {
  btnReset.addEventListener("click", async () => {
    const email = document.getElementById("resetEmail").value.trim();
    const code = document.getElementById("resetCode").value.trim();
    const newPassword = document.getElementById("newPassword").value;
    if (!email || !code || !newPassword) return alert("กรอกข้อมูลให้ครบ");
    try {
      const r = await call("resetPassword", { email, code, newPassword });
      if (r.error) return alert(r.error);
      alert("รีเซ็ตรหัสผ่านสำเร็จ โปรดล็อกอินอีกครั้ง");
      window.location = "login.html";
    } catch (e) { alert("เกิดข้อผิดพลาด: " + e.message); }
  });
}
