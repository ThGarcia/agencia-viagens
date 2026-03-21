const BASE_URL = "http://localhost:8080";

export async function getContracts() {
    const res = await fetch(`${BASE_URL}/contracts`);
    return res.json();
}
