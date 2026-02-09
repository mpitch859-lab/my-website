// js/transactions.js
import { callApi, showNotify } from "./api-client.js";

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
    if (!amount || !date) return showNotify('แจ้งเตือน', 'กรุณากรอกข้อมูล', 'warning');
    const resp = await callApi("add", { type, category, amount, date, note });
    showNotify('บันทึกสำเร็จ', 'บันทึกเรียบร้อย');
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
        showNotify('สำเร็จ', 'แก้ไขเรียบร้อย');
        loadTransactions();
    });
    });
    document.querySelectorAll(".del").forEach(btn => {
    btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        Swal.fire({
            title: 'ต้องการลบรายการนี้?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก',
            customClass: { popup: 'equili-popup' }
        }).then(async (result) => {
            if (result.isConfirmed) {
                await callApi("delete", { id });
                showNotify('สำเร็จ', 'ลบเรียบร้อย');
                loadTransactions();
            }
        });;
    });
    });
} catch (e) { console.error(e); if (e.message) alert(e.message); }
}

if (window.location.pathname.split("/").pop() === "record.html") {
window.addEventListener("DOMContentLoaded", loadTransactions);
}
