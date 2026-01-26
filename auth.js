// js/auth.js
import { callApi } from "./api-client.js";

// --- REGISTER ---
const btnRegister = document.getElementById("btnRegister");
if (btnRegister) {
    btnRegister.addEventListener("click", async () => {
        const email = document.getElementById("regEmail").value;
        const password = document.getElementById("regPassword").value;
        if (!email || !password) return alert("กรุณากรอกข้อมูลให้ครบ");
        try {
            const res = await callApi("register", { email, password });
            if (res.success) {
                alert("สมัครสมาชิกสำเร็จ!");
                window.location.href = "login.html";
            } else {
                alert("สมัครไม่สำเร็จ: " + res.error);
            }
        } catch (err) { alert("เกิดข้อผิดพลาดในการเชื่อมต่อ"); }
    });
}

// --- LOGIN ---
const btnLogin = document.getElementById("btnLogin");
if (btnLogin) {
    btnLogin.addEventListener("click", async () => {
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
        if (!email || !password) return alert("กรุณากรอกข้อมูลให้ครบ");
        try {
            const res = await callApi("login", { email, password });
            if (res.success) {
                sessionStorage.setItem("session_token", res.data.token);
                window.location.href = "record.html";
            } else {
                alert("เข้าสู่ระบบไม่สำเร็จ: " + res.error);
            }
        } catch (err) { alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง"); }
    });
}

// --- LOGOUT ---
const btnLogout = document.getElementById("btnLogout");
if (btnLogout) {
    btnLogout.addEventListener("click", () => {
        sessionStorage.clear();
        window.location.href = "login.html";
    });
}

// --- PROTECT PAGES ---
const protectedPagesList = ["record.html", "analysis.html", "calendar.html"];
const currentPageName = window.location.pathname.split("/").pop();
if (protectedPagesList.includes(currentPageName)) {
    if (!sessionStorage.getItem("session_token")) window.location.href = "login.html";}