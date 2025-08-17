import User from "../models/userModel.js";
import sequelize from "../utils/db.js";
import { dataValid } from "../validations/dataValidation.js";
import { success, error } from "../utils/response.js";
import { compare } from "../utils/bcrypt.js";
import {
  generateAccessToken,
  generateRefreshToken,
  parseJWT,
  verifyRefreshToken,
} from "../utils/jwt.js";

class UserController {
  // REGISTER
  async setUser(req, res, next) {
    const t = await sequelize.transaction();
    const rules = {
      name: "required",
      email: "required|isEmail",
      password: "required|isStrongPassword",
      confirmPassword: "required",
    };

    try {
      const validation = await dataValid(rules, req.body);

      if (validation.data.password !== validation.data.confirmPassword) {
        return res
          .status(400)
          .json(error("Password and confirm password do not match", null, 400));
      }
      if (validation.errors && validation.errors.length > 0) {
        return res
          .status(422)
          .json(error("Validation failed", validation.errors, 422));
      }

      const { email, name, password } = validation.data;

      const userExist = await User.findOne({ where: { email } });
      if (userExist) {
        if (userExist.isActive) {
          return res
            .status(400)
            .json(error("Email already activated", null, 400));
        }

        if (
          !userExist.isActive &&
          Date.parse(userExist.expireTime) > Date.now()
        ) {
          return res
            .status(400)
            .json(
              error(
                "Email already registered, please check your email",
                null,
                400
              )
            );
        }

        await User.destroy({ where: { email }, transaction: t });
      }

      const newUser = await User.create(
        {
          name,
          email,
          password,
          expireTime: new Date(Date.now() + 60 * 60 * 1000),
        },
        { transaction: t }
      );

      await t.commit();

      return res.status(201).json(
        success("User created successfully", {
          userId: newUser.userId,
          email: newUser.email,
          name: newUser.name,
          expireTime: newUser.expireTime,
        })
      );
    } catch (err) {
      await t.rollback();
      next(err);
    }
  }

  // LOGIN
  async setLogin(req, res, next) {
    try {
      const { email, password } = req.body;

      const rules = {
        email: "required|isEmail",
        password: "required",
      };
      const validation = await dataValid(rules, { email, password });
      const data = validation.data;

      if (validation.errors && validation.errors.length > 0) {
        return res
          .status(400)
          .json(error("Validation failed", validation.errors, 400));
      }

      const user = await User.findOne({
        where: { email: data.email, isActive: true },
      });

      if (!user) {
        return res
          .status(404)
          .json(
            error("User not found or inactive", { email: data.email }, 404)
          );
      }

      const isMatch = await compare(data.password, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json(error("Invalid email or password", null, 401));
      }

      const usr = {
        userId: user.userId,
        email: user.email,
        name: user.name,
      };
      const token = generateAccessToken(usr);
      const refreshToken = generateRefreshToken(usr);

      return res.status(200).json(
        success("Login successful", {
          userId: user.userId,
          email: user.email,
          name: user.name,
          isActive: user.isActive,
          expireTime: user.expireTime,
          token,
          refreshToken,
        })
      );
    } catch (err) {
      next(
        new Error("controllers/userController.js:setLogin - " + err.message)
      );
    }
  }

  // REFRESH TOKEN
  async refreshToken(req, res, next) {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      if (!token) {
        return res.status(401).json(error("No token provided", null, 401));
      }

      const verify = verifyRefreshToken(token);
      if (verify) {
        const newAccessToken = generateAccessToken(verify);
        return res
          .status(200)
          .json(success("Token refreshed", { token: newAccessToken }));
      }

      const data = parseJWT(token);
      const user = await User.findOne({
        where: { email: data.email, isActive: true },
      });

      if (!user) {
        return res
          .status(404)
          .json(
            error("User not found or inactive", { email: data.email }, 404)
          );
      }

      const usr = {
        userId: user.userId,
        email: user.email,
        name: user.name,
      };
      const newToken = generateAccessToken(usr);
      const newRefreshToken = generateRefreshToken(usr);

      return res.status(200).json(
        success("Refresh successful", {
          data: usr,
          token: newToken,
          refreshToken: newRefreshToken,
        })
      );
    } catch (err) {
      next(
        new Error("controllers/userController.js:refreshToken - " + err.message)
      );
    }
  }
}

// ✅ Export sekali, versi ESM
export default new UserController();
