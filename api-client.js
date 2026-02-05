// api-client.js
import { GAS_URL } from "./config.js";

export async function callApi(action, data = {}) {
  const res = await fetch(GAS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ action, ...data })
  });

  return await res.json();
}
