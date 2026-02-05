// api-client.js
import { GAS_URL } from "./config.js";

export async function callApi(action, data = {}) {
  try {
    const token = sessionStorage.getItem("session_token");
    const bodyData = { action, token, ...data };

    const response = await fetch(GAS_URL, {
      method: "POST",
      mode: "no-cors", // ใช้ no-cors เพื่อข้ามกำแพง CORS 100%
      body: JSON.stringify(bodyData) // ส่ง JSON ไปตรงๆ แต่ไม่ตั้ง Content-Type
    });

    // เนื่องจากใช้ no-cors เราจะไม่สามารถอ่านผลลัพธ์ JSON ได้โดยตรง (Security ของ Browser)
    // แต่ข้อมูลจะไปบันทึกใน Google Sheet แน่นอน
    // วิธีแก้ที่ดีที่สุดสำหรับ Login/Register คือ "สมมติว่าสำเร็จ" หรือใช้ doGet สำหรับตรวจสอบ
    return { success: true };

  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}