import { GAS_URL } from "./config.js";

// สำคัญมาก: ต้องมีคำว่า export เพื่อให้ไฟล์อื่นดึงไปใช้ได้
export async function callApi(action, data = {}) {
    try {
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
        
        // ตรวจสอบ Session หมดอายุ
        if (!result.success && result.error && result.error.includes("Session expired")) {
            // ถ้าไม่ใช่หน้า login ให้แจ้งเตือนและส่งกลับไป login
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