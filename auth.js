// js/auth.js
import { callApi } from "./api-client.js";

/* ---------- REGISTER ---------- */
const btnRegister = document.getElementById("btnRegister");
if (btnRegister) {
  btnRegister.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value.trim();
    if (!email || !password) return alert("กรุณากรอกข้อมูลให้ครบ");
    try {
      await callApi("register", { email, password });
      alert("สมัครสมาชิกสำเร็จ");
      window.location.href = "login.html";
    } catch (err) {
      alert(err.message);
    }
  });
}

/* ---------- LOGIN ---------- */
const btnLogin = document.getElementById("btnLogin");
if (btnLogin) {
  btnLogin.addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    if (!email || !password) return alert("กรุณากรอกข้อมูลให้ครบ");

    try {
      const data = await callApi("login", { email, password });
      sessionStorage.setItem("session_token", data.token);
      alert("เข้าสู่ระบบสำเร็จ");
      window.location.href = "record.html";
    } catch (err) {
      alert(err.message);
    }
  });
}

/* ---------- LOGOUT ---------- */
const btnLogout = document.getElementById("btnLogout");
if (btnLogout) {
  btnLogout.addEventListener("click", () => {
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