import { GAS_URL } from "./config.js";

export async function callApi(action, data = {}) {
    try {
        const token = sessionStorage.getItem("session_token");
        const bodyData = { action, token, ...data };

        const response = await fetch(GAS_URL, {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            redirect: "follow",
            body: JSON.stringify(bodyData)
        });

        const result = await response.json();

        if (!result.success && result.error?.includes("Session expired")) {
            if (!window.location.pathname.includes("login.html")) {
                alert("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่");
                sessionStorage.clear();
                window.location.href = "login.html";
            }
            return;
        }

        if (!result.success) throw new Error(result.error);
        return result;

    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}
