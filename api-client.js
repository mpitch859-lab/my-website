// api-client.js
import { GAS_URL } from "./config.js";

export async function callApi(action, data = {}) {
  try {
    const token = sessionStorage.getItem("session_token");

    // เช็คก่อนว่าลืมตั้งค่า URL หรือไม่
    if (typeof GAS_URL === 'undefined' || !GAS_URL) {
      throw new Error("GAS_URL is not defined. ตรวจสอบไฟล์ config.js");
    }

    const res = await fetch(GAS_URL, {
      method: "POST",
      mode: "cors",
      headers: {
        // ใช้ text/plain เพื่อข้ามปัญหา CORS Preflight ใน Google Apps Script
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        action,
        token,
        ...data
      })
    });

    // ตรวจสอบสถานะการตอบกลับ
    if (!res.ok) throw new Error("Server responded with status " + res.status);

    const result = await res.json();
    return result;

  } catch (err) {
    console.error("API ERROR DETAILS:", err);
    // ส่ง error กลับไปให้หน้า UI แสดงผล
    return {
      success: false,
      error: err.message || "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้"
    };
  }
}