// api-client.js
import { GAS_URL } from "./config.js";

export async function callApi(action, data = {}) {
  try {
    const token = sessionStorage.getItem("session_token");

    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action,
        token,       // ✅ ส่ง token ไปทุก request
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
