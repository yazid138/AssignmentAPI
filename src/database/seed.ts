import "dotenv/config";
import connection from "./connection";
import { seedBanners } from "./seeder/banner.seeder";
import { seedServices } from "./seeder/service.seeder";

const seed = async () => {
  try {
    console.log("Seeding started...");

    await seedBanners(connection);
    await seedServices(connection);

    console.log("Seeding finished successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seed();
