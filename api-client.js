import { GAS_URL } from "./config.js";

export async function callApi(action, data = {}) {
    try {
        // ดึง token จาก sessionStorage มาใส่ใน bodyData เสมอ
        const token = sessionStorage.getItem("session_token");
        const bodyData = {
            action,
            token,
            ...data
        };

        const response = await fetch(GAS_URL, {
            method: "POST",
            body: JSON.stringify(bodyData)
        });

        const result = await response.json();
        
        // ถ้าเซสชันหมดอายุ ให้เด้งกลับหน้า Login ทันที
        if (!result.success && result.error && result.error.includes("Session expired")) {
            alert("เซสชันหมดอายุหรือยังไม่ได้เข้าสู่ระบบ");
            sessionStorage.clear();
            window.location.href = "login.html";
            return;
        }

        if (!result.success) throw new Error(result.error);
        return result;
    } catch (error) {
        console.error("API Error:", error);
        if (!error.message.includes("Session expired")) {
            alert("เกิดข้อผิดพลาด: " + error.message);
        }
        throw error;
    }
}