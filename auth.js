import { callApi } from "./api-client.js";

// REGISTER
document.getElementById("btnRegister")?.addEventListener("click", async () => {
  const email = regEmail.value;
  const password = regPassword.value;
  const res = await callApi("register", { email, password });
  if (res.success) {
    alert("สมัครสำเร็จ");
    location.href = "login.html";
  } else alert(res.error);
});

// LOGIN
document.getElementById("btnLogin")?.addEventListener("click", async () => {
  const email = loginEmail.value;
  const password = loginPassword.value;
  const res = await callApi("login", { email, password });
  if (res.success) {
    sessionStorage.setItem("session_token", res.data.token);
    location.href = "record.html";
  } else alert(res.error);
});

// LOGOUT
document.getElementById("btnLogout")?.addEventListener("click", () => {
  sessionStorage.clear();
  location.href = "login.html";
});

// PROTECT
const protectedPages = ["record.html","analysis.html","calendar.html"];
const page = location.pathname.split("/").pop();
if (protectedPages.includes(page) && !sessionStorage.getItem("session_token")) {
  location.href = "login.html";
}
