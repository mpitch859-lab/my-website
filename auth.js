// js/auth.js
import { callApi } from "./api-client.js";

/* ---------- REGISTER ---------- */
const btnRegister = document.getElementById("btnRegister");
if (btnRegister) {
  btnRegister.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = regEmail.value.trim();
    const password = regPassword.value.trim();
    const r = await callApi("register", { email, password });
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
    const r = await callApi("login", { email, password });
    if (r.error) return alert(r.error);
    sessionStorage.setItem("session_token", r.data.token);
    location.href = "record.html";
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