// api-client.js
import { GAS_URL } from "./config.js";

export async function callApi(action, data = {}) {
  try {
    const token = sessionStorage.getItem("session_token");

    const res = await fetch(GAS_URL, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "text/plain"
      },
      body: JSON.stringify({
        action,
        token,
        ...data
      })
    });

    const result = await res.json();
    return result;

  } catch (err) {
    console.error("API ERROR:", err);
    return { success: false, error: "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้" };
  }
}
export function showNotify(title, text, type = 'success') {
    Swal.fire({
        title: title,
        text: text,
        icon: type,
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#0b84ff',
        customClass: {
            popup: 'equili-popup',
            confirmButton: 'equili-button'
        }
    });
}