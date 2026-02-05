// api-client.js
import { GAS_URL } from "./config.js";

export async function callApi(action, data = {}) {
  try {
    const token = sessionStorage.getItem("session_token");

    const res = await fetch(GAS_URL, {
      method: "POST",
      mode: "cors", // เพิ่มตรงนี้เพื่อให้มั่นใจ
      headers: {
        // ใช้ text/plain เพื่อข้ามปัญหา CORS ในบาง Browser
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        action,
        token,
        ...data
      })
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    return await res.json();
  } catch (err) {
    console.error("API ERROR:", err);
    return {
      success: false,
      message: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้"
    };
  }
}