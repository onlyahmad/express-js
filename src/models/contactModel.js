import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";
import User from "./userModel.js";

const Contact = sequelize.define(
  "Contact",
  {
    contactId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        const first = this.getDataValue("firstName") || "";
        const last = this.getDataValue("lastName") || "";
        return `${first} ${last}`.trim();
      },
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
      set(value) {
        if (value) {
          this.setDataValue("email", value.toLowerCase());
        }
      },
    },
    phone: {
      type: DataTypes.STRING,
      validate: {
        is: /^\+?[1-9]\d{1,14}$/, // format E.164
      },
    },
  },
  {
    tableName: "contact",
    underscored: true,
    timestamps: true, // created_at & updated_at
  }
);

// Relasi
User.hasMany(Contact, {
  foreignKey: "user_id",
  as: "contacts",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});

Contact.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});

export default Contact;
