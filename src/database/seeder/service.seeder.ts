import { Pool } from "mysql2/promise";

export const seedServices = async (connection: Pool) => {
  await connection.execute("SET FOREIGN_KEY_CHECKS = 0");
  await connection.execute("TRUNCATE TABLE services");
  await connection.execute("SET FOREIGN_KEY_CHECKS = 1");

  const services = [
    {
      service_code: "PAJAK",
      service_name: "Pajak PBB",
      service_icon: "https://nutech-integrasi.app/dummy.jpg",
      service_tariff: 40000,
      description: "Pajak PBB",
    },
    {
      service_code: "PLN",
      service_name: "Listrik",
      service_icon: "https://nutech-integrasi.app/dummy.jpg",
      service_tariff: 10000,
      description: "PLN Pascabayar",
    },
    {
      service_code: "PDAM",
      service_name: "PDAM Berlangganan",
      service_icon: "https://nutech-integrasi.app/dummy.jpg",
      service_tariff: 40000,
      description: "PDAM Berlangganan",
    },
    {
      service_code: "PULSA",
      service_name: "Pulsa",
      service_icon: "https://nutech-integrasi.app/dummy.jpg",
      service_tariff: 40000,
      description: "Pulsa Indosat",
    },
    {
      service_code: "PGN",
      service_name: "PGN Berlangganan",
      service_icon: "https://nutech-integrasi.app/dummy.jpg",
      service_tariff: 50000,
      description: "PGN Berlangganan",
    },
    {
      service_code: "MUSIK",
      service_name: "Musik Berlangganan",
      service_icon: "https://nutech-integrasi.app/dummy.jpg",
      service_tariff: 50000,
      description: "Musik Berlangganan",
    },
    {
      service_code: "TV",
      service_name: "TV Berlangganan",
      service_icon: "https://nutech-integrasi.app/dummy.jpg",
      service_tariff: 50000,
      description: "TV Berlangganan",
    },
    {
      service_code: "PAKET_DATA",
      service_name: "Paket data",
      service_icon: "https://nutech-integrasi.app/dummy.jpg",
      service_tariff: 50000,
      description: "Paket data",
    },
    {
      service_code: "VOUCHER_GAME",
      service_name: "Voucher Game",
      service_icon: "https://nutech-integrasi.app/dummy.jpg",
      service_tariff: 100000,
      description: "Voucher Game",
    },
    {
      service_code: "VOUCHER_MAKANAN",
      service_name: "Voucher Makanan",
      service_icon: "https://nutech-integrasi.app/dummy.jpg",
      service_tariff: 100000,
      description: "Voucher Makanan",
    },
    {
      service_code: "QURBAN",
      service_name: "Qurban",
      service_icon: "https://nutech-integrasi.app/dummy.jpg",
      service_tariff: 200000,
      description: "Qurban",
    },
    {
      service_code: "ZAKAT",
      service_name: "Zakat",
      service_icon: "https://nutech-integrasi.app/dummy.jpg",
      service_tariff: 300000,
      description: "Zakat",
    }
  ];

  for (const service of services) {
    await connection.execute(
      "INSERT INTO services (service_code, service_name, service_icon, service_tariff, description) VALUES (?, ?, ?, ?, ?)",
      [service.service_code, service.service_name, service.service_icon, service.service_tariff, service.description]
    );
  }
  console.log("Seeded services successfully.");
};
