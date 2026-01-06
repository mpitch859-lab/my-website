// js/auth.js
import { callApi } from "./api-client.js";

// REGISTER
const btnRegister = document.getElementById("btnRegister");
if (btnRegister) {
    btnRegister.addEventListener("click", async (e) => {
        const email = document.getElementById("regEmail").value;
        const password = document.getElementById("regPassword").value;
        if (!email || !password) return alert("กรุณากรอกข้อมูลให้ครบ");
        await callApi("register", { email, password });
        alert("สมัครสำเร็จ!");
        location.href = "login.html";
    });
}

// LOGIN
const btnLogin = document.getElementById("btnLogin");
if (btnLogin) {
    btnLogin.addEventListener("click", async () => {
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
        const res = await callApi("login", { email, password });
        sessionStorage.setItem("session_token", res.data.token);
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