import { Sequelize } from "sequelize";
import "dotenv/config";

const sequelize = new Sequelize(
  process.env.DB_DATABASE || "test_db",
  process.env.DB_USERNAME || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_CONNECTION || "mysql", // mysql / mariadb
    logging:
      process.env.NODE_ENV === "development"
        ? (...msg) => console.log("[Sequelize]", ...msg)
        : false,
    dialectOptions: {
      dateStrings: true,
      typeCast: (field, next) => {
        if (field.type === "DATETIME") {
          return field.string() ? new Date(field.string()) : null;
        }
        return next();
      },
    },
    timezone: "+08:00", // Asia/Makassar offset
    pool: {
      max: 10, // maksimal koneksi
      min: 0, // minimal koneksi
      acquire: 30000, // timeout ambil koneksi
      idle: 10000, // waktu idle koneksi sebelum dilepas
    },
  }
);

// 🔹 Test koneksi
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();

export default sequelize;
