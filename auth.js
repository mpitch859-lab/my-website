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

  if (res.success) {
    alert("สมัครสำเร็จ");
    location.href = "login.html";
  } else {
    alert(res.message || "สมัครไม่สำเร็จ");
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

  if (res.success) {
    sessionStorage.setItem("session_token", res.token);
    location.href = "record.html";
  } else {
    alert(res.message || "เข้าสู่ระบบไม่สำเร็จ");
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
