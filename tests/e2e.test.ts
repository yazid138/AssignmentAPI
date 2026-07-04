import { describe, test, expect } from "bun:test";

const BASE_URL = process.env.API_URL || "http://localhost:5000";

describe("API E2E Tests", () => {
  const uniqueEmail = `e2e_${Date.now()}@example.com`;
  const password = "password123";
  let authToken = "";

  test("1. User Registration", async () => {
    const response = await fetch(`${BASE_URL}/registration`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: "E2E",
        last_name: "Tester",
        email: uniqueEmail,
        password: password,
      }),
    });

    const body = await response.json();
    expect(response.status).toBe(201);
    expect(body.status).toBe(0);
    expect(body.message).toBe("Registrasi berhasil silahkan login");
  });

  test("2. User Login", async () => {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: uniqueEmail,
        password: password,
      }),
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.status).toBe(0);
    expect(body.message).toBe("Berhasil Login");
    expect(body.data).toBeDefined();
    expect(body.data.token).toBeDefined();
    authToken = body.data.token;
  });

  test("3. Get User Profile", async () => {
    const response = await fetch(`${BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.status).toBe(0);
    expect(body.message).toBe("Sukses");
    expect(body.data.email).toBe(uniqueEmail);
    expect(body.data.first_name).toBe("E2E");
    expect(body.data.last_name).toBe("Tester");
  });

  test("4. Get Balance (Initial)", async () => {
    const response = await fetch(`${BASE_URL}/balance`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.status).toBe(0);
    expect(body.message).toBe("Success");
    expect(body.data.balance).toBe(0);
  });

  test("5. Top Up Balance", async () => {
    const response = await fetch(`${BASE_URL}/topup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        top_up_amount: 50000,
      }),
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.status).toBe(0);
    expect(body.message).toBe("Top Up Balance berhasil");
    expect(body.data.balance).toBe(50000);
  });

  test("6. Execute Payment (PLN - 10000)", async () => {
    const response = await fetch(`${BASE_URL}/transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        service_code: "PLN",
      }),
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.status).toBe(0);
    expect(body.message).toBe("Transaksi berhasil");
    expect(body.data.service_code).toBe("PLN");
    expect(body.data.service_name).toBe("Listrik");
    expect(body.data.transaction_type).toBe("PAYMENT");
    expect(body.data.total_amount).toBe(10000);
  });

  test("7. Get Balance (After Payment)", async () => {
    const response = await fetch(`${BASE_URL}/balance`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.status).toBe(0);
    expect(body.data.balance).toBe(40000); // 50000 - 10000
  });

  test("8. Insufficient Balance Check", async () => {
    const response = await fetch(`${BASE_URL}/transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        service_code: "ZAKAT", // Zakat costs 300000
      }),
    });

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.status).toBe(102);
    expect(body.message).toBe("Saldo tidak mencukupi");
  });

  test("9. Get Transaction History", async () => {
    const response = await fetch(`${BASE_URL}/transaction/history`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.status).toBe(0);
    expect(body.message).toBe("Get History Berhasil");
    expect(body.data.records.length).toBeGreaterThanOrEqual(2);

    // Verify history details
    const paymentTx = body.data.records.find((tx: any) => tx.transaction_type === "PAYMENT");
    const topupTx = body.data.records.find((tx: any) => tx.transaction_type === "TOPUP");

    expect(paymentTx).toBeDefined();
    expect(paymentTx.total_amount).toBe(10000);
    expect(paymentTx.description).toBe("PLN Pascabayar"); // Verifying description is populated

    expect(topupTx).toBeDefined();
    expect(topupTx.total_amount).toBe(50000);
  });
});
