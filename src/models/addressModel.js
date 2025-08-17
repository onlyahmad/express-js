import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";
import Contact from "./contactModel.js";

const Address = sequelize.define(
  "Address",
  {
    addressId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    addressType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
    },
    province: {
      type: DataTypes.STRING,
    },
    country: {
      type: DataTypes.STRING,
    },
    zipCode: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "address",
    underscored: true,
    timestamps: true, // otomatis created_at & updated_at
  }
);

// Relations
Contact.hasMany(Address, {
  foreignKey: "contactId",
  as: "addresses",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});

Address.belongsTo(Contact, {
  foreignKey: "contactId",
  as: "contact",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});

export default Address;
