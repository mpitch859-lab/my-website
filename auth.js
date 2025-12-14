import { WEB_APP_URL } from "./config.js";

async function call(action, payload = {}, token = null) {
  const params = new URLSearchParams();
  params.set("action", action);
  params.set("payload", JSON.stringify(payload));
  if (token) params.set("token", token);
  const url = `${WEB_APP_URL}?${params.toString()}`;
  const res = await fetch(url); // ← GET ONLY
  return await res.json();
}

/* ---------- REGISTER ---------- */
const btnRegister = document.getElementById("btnRegister");
if (btnRegister) {
  btnRegister.addEventListener("click", async () => {
    const email = regEmail.value.trim();
    const password = regPassword.value.trim();
    const r = await call("register", { email, password });
    if (r.error) return alert(r.error);
    alert("สมัครสมาชิกสำเร็จ");
    location.href = "login.html";
  });
}

/* ---------- LOGIN ---------- */
const btnLogin = document.getElementById("btnLogin");
if (btnLogin) {
  btnLogin.addEventListener("click", async () => {
    const email = loginEmail.value.trim();
    const password = loginPassword.value;
    const r = await call("login", { email, password });
    if (r.error) return alert(r.error);
    sessionStorage.setItem("session_token", r.data.token);
    location.href = "record.html";
  });
}

/* ---------- LOGOUT ---------- */
const btnLogout = document.getElementById("btnLogout");
if (btnLogout) {
  btnLogout.addEventListener("click", async () => {
    const token = sessionStorage.getItem("session_token");
    if (token) await call("logout", {}, token);
    sessionStorage.clear();
    window.location.href = "login.html";
  });
}

/* ---------- PROTECT PAGES ---------- */
const protectedPages = ["record.html", "analysis.html", "calendar.html"];
const path = window.location.pathname.split("/").pop();
if (protectedPages.includes(path)) {
  const token = sessionStorage.getItem("session_token");
  if (!token) window.location.href = "login.html";
}

/* ---------- FORGOT PASSWORD ---------- */
const btnForgot = document.getElementById("btnForgot");
if (btnForgot) {
  btnForgot.addEventListener("click", async () => {
    const email = document.getElementById("forgotEmail").value.trim();
    if (!email) return alert("กรอกอีเมล");
    try {
      const r = await call("forgotPassword", { email });
      if (r.error) return alert(r.error);
      alert("ส่งโค้ดรีเซ็ตแล้ว");
      window.location.href = "reset.html";
    } catch {
      alert("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
    }
  });
}

/* ---------- RESET PASSWORD ---------- */
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
      alert("เปลี่ยนรหัสผ่านสำเร็จ");
      window.location.href = "login.html";
    } catch {
      alert("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
    }
  });
}