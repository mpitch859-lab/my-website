export default async function handler(req, res) {
try {
    const GAS_URL =
    "https://script.google.com/macros/s/AKfycbxF3orxDopiJL0uhXfwTrju82fqcm_QNjIzU-__PTAwEmz55-5hbY4E0QwN4b8_vvk-/exec";
    const query = new URLSearchParams(req.query).toString();
    const url = `${GAS_URL}?${query}`;
    const r = await fetch(url);
    const text = await r.text();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).send(text);
} catch (err) {
    res.status(500).json({ error: err.message });
}
}