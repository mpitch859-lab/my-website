//api-client.js
import { GAS_URL } from "./config.js";

export async function callApi(action, data = {}) {
    try {
        const token = sessionStorage.getItem("session_token");
        const bodyData = { action, token, ...data };

        const response = await fetch(GAS_URL, {
            method: "POST",
            mode: "cors",
            body: JSON.stringify(bodyData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        if (!text) throw new Error("Empty response from server");
        
        return JSON.parse(text);
    } catch (error) {
        console.error("API Error Detail:", error);
        throw error;
    }
}
