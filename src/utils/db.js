import { Sequelize } from "sequelize";
import "dotenv/config";

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_CONNECTION, // mysql / mariadb
    logging:
      process.env.NODE_ENV === "development"
        ? (...msg) => console.log(msg)
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
  }
);

export default sequelize;
