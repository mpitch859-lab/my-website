import { API_URL } from "./config.js";

async function call(action, payload = {}) {
  const params = new URLSearchParams({
    action,
    payload: JSON.stringify(payload)
  });
  const res = await fetch(`${API_URL}?${params.toString()}`);
  return await res.json();
}

export { call };

/* ---------- REGISTER ---------- */
btnRegister.addEventListener("click", async () => {
  const email = regEmail.value.trim();
  const password = regPassword.value.trim();
  const r = await call("register", { email, password });
  if (r.error) return alert(r.error);
  alert("สมัครสมาชิกสำเร็จ");
  window.location = "login.html";
});

/* ---------- LOGIN ---------- */
const btnLogin = document.getElementById("btnLogin");
if (btnLogin) {
  btnLogin.addEventListener("click", async () => {
  const email = loginEmail.value.trim();
  const password = loginPassword.value;
  const r = await call("login", { email, password });
  if (r.error) return alert(r.error);
  sessionStorage.setItem("session_token", r.data.token);
  window.location = "record.html";
});
}

/* ---------- LOGOUT ---------- */
btnLogout.addEventListener("click", async () => {
  const token = sessionStorage.getItem("session_token");
  if (token) await call("logout", {}, token);
  sessionStorage.clear();
  window.location = "login.html";
});

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