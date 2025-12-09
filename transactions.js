// js/transactions.js
import { callApi } from "./api-client.js";

const btnSave = document.getElementById("btnSave");
const listDiv = document.getElementById("list");
if (btnSave) {
btnSave.addEventListener("click", async () => {
    try {
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value || "";
    const amount = parseFloat(document.getElementById("amount").value);
    const date = document.getElementById("date").value;
    const note = document.getElementById("note").value || "";
    if (!amount || !date) return alert("กรุณากรอกจำนวนเงินและวันที่");
    const resp = await callApi("add", { type, category, amount, date, note });
    alert("บันทึกเรียบร้อย");
    loadTransactions();
    } catch (e) { alert("เกิดข้อผิดพลาด: " + e.message); }
});
}
export async function loadTransactions() {
try {
    const resp = await callApi("list", {});
    const data = resp.data || [];
    listDiv.innerHTML = "";
    data.forEach(item => {
    const el = document.createElement("div");
    el.className = "txn";
    el.innerHTML = `
        <div>
        <strong>${item.date}</strong> — ${item.type} — ${item.amount} บาท
        <div class="muted">${item.category || ''} ${item.note ? '- ' + item.note : ''}</div>
        </div>
        <div class="actions">
        <button data-id="${item.id}" class="edit">แก้ไข</button>
        <button data-id="${item.id}" class="del">ลบ</button>
        </div>
    `;
    listDiv.appendChild(el);
    });
    document.querySelectorAll(".edit").forEach(btn => {
    btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        const newAmount = prompt("จำนวนใหม่ (บาท):");
        const newNote = prompt("หมายเหตุใหม่:", "");
        if (!newAmount) return;
        await callApi("update", { id, amount: parseFloat(newAmount), note: newNote });
        alert("แก้ไขเรียบร้อย");
        loadTransactions();
    });
    });
    document.querySelectorAll(".del").forEach(btn => {
    btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        if (!confirm("ต้องการลบรายการนี้หรือไม่?")) return;
        await callApi("delete", { id });
        alert("ลบเรียบร้อย");
        loadTransactions();
    });
    });
} catch (e) { console.error(e); if (e.message) alert(e.message); }
}
// load on page ready
if (window.location.pathname.split("/").pop() === "record.html") {
window.addEventListener("DOMContentLoaded", loadTransactions);
}
