import sequelize from "../utils/db";
import { Sequelize } from "sequelize";
import User from "./userModel";

const Contact= sequelize.define("Contact",{
    contactId:{
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    firstName:{
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName:{
        type: Sequelize.STRING,
    },
    fullName:{
        type: Sequelize.VIRTUAL,
        get() {
            return `${this.firstName} ${this.lastName}`;
        }
    },
    email:{
        type: Sequelize.STRING,
        validate: {
            isEmail: true
        },
        set(value) {
            this.setDataValue("email", value.toLowerCase());
        }
    },
    phone:{
        type: Sequelize.STRING,
        validate: {
            is: /^\+?[1-9]\d{1,14}$/
        }
    }

}, {
    tableName: "contact",
    underscored: true
})

User.hasMany(Contact, {
    foreignKey: "user_id",
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT"
})

Contact.belongsTo(User, {
    foreignKey: "user_id",
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT"
})

sequelize.sync();

export default Contact;