import { API_URL } from "./config.js";

/* ---------- API CALL ---------- */
async function call(action, payload = {}) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      action,
      payload
    })
  });
  if (!res.ok) {
    throw new Error("Network error");
  }
  return await res.json();
}

/* ---------- REGISTER ---------- */
const btnRegister = document.getElementById("btnRegister");
if (btnRegister) {
  btnRegister.addEventListener("click", async () => {
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value.trim();
    try {
      const r = await call("register", { email, password });
      if (r.error) return alert(r.error);
      alert("สมัครสมาชิกสำเร็จ");
      window.location.href = "login.html";
    } catch (e) {
      console.error(e);
      alert("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
    }
  });
}


/* ---------- LOGIN ---------- */
const btnLogin = document.getElementById("btnLogin");
if (btnLogin) {
  btnLogin.addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    if (!email || !password) return alert("กรุณากรอกข้อมูลให้ครบ");
    const r = await call("login", { email, password });
    if (r.error) return alert(r.error);
    sessionStorage.setItem("session_token", r.data.token);
    window.location.href = "record.html";
  });
}

/* ---------- LOGOUT ---------- */
const btnLogout = document.getElementById("btnLogout");
if (btnLogout) {
  btnLogout.addEventListener("click", async () => {
    await call("logout");
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
    const r = await call("forgotPassword", { email });
    if (r.error) return alert(r.error);
    alert("ส่งโค้ดรีเซ็ตแล้ว");
    window.location.href = "reset.html";
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
    const r = await call("resetPassword", { email, code, newPassword });
    if (r.error) return alert(r.error);
    alert("เปลี่ยนรหัสผ่านสำเร็จ");
    window.location.href = "login.html";
  });
}