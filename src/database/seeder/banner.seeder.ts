import { Pool } from "mysql2/promise";

export const seedBanners = async (connection: Pool) => {
  await connection.query("SET FOREIGN_KEY_CHECKS = 0");
  await connection.query("TRUNCATE TABLE banners");
  await connection.query("SET FOREIGN_KEY_CHECKS = 1");

    const banners = [
      {
        banner_name: "Banner 1",
        banner_image: "https://nutech-integrasi.app/dummy.jpg",
        description: "Lerem Ipsum Dolor sit amet"
      },
      {
        banner_name: "Banner 2",
        banner_image: "https://nutech-integrasi.app/dummy.jpg",
        description: "Lerem Ipsum Dolor sit amet"
      },
      {
        banner_name: "Banner 3",
        banner_image: "https://nutech-integrasi.app/dummy.jpg",
        description: "Lerem Ipsum Dolor sit amet"
      },
      {
        banner_name: "Banner 4",
        banner_image: "https://nutech-integrasi.app/dummy.jpg",
        description: "Lerem Ipsum Dolor sit amet"
      },
      {
        banner_name: "Banner 5",
        banner_image: "https://nutech-integrasi.app/dummy.jpg",
        description: "Lerem Ipsum Dolor sit amet"
      },
      {
        banner_name: "Banner 6",
        banner_image: "https://nutech-integrasi.app/dummy.jpg",
        description: "Lerem Ipsum Dolor sit amet"
      }
    ];

    for (const banner of banners) {
      await connection.query(
        "INSERT INTO banners (banner_name, banner_image, description) VALUES (?, ?, ?)",
        [banner.banner_name, banner.banner_image, banner.description]
      );
    }
    console.log("Seeded banners successfully.");
}