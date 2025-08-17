import sequelize from "../utils/db.js";
import { Sequelize } from "sequelize";
import {encrypt} from "../utils/bcrypt.js";
import moment from "moment";

const User = sequelize.define(
  "User",
  {
    userId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
      set(value) {
        this.setDataValue("email", value.toLowerCase());
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue("password", encrypt(value));
      },
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    expireTime: {
      type: Sequelize.DATE,
      set(value) {
        if (value !== null) {
          this.setDataValue("expireTime", moment(value).add(1, "hours").toDate());
        } else {
          this.setDataValue("expireTime", null);
        }
      },
    },
  },
  {
    tableName: "user",   // <- taruh di sini
    underscored: true,
    timestamps: true,    // otomatis ada createdAt & updatedAt (opsional)
  }
);

sequelize.sync();

export default User;
