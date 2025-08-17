import validator from "validator";
import { isExists, sanitization } from "./sanitization.js";

const dataValid = async (valid, dt) => {
  let errors = [];
  const data = await sanitization(dt);

  for (const [key, value] of Object.entries(data)) {
    if (!valid[key]) continue;

    // Bisa terima rules sebagai string dipisah "|" atau array
    const rules = Array.isArray(valid[key])
      ? valid[key]
      : String(valid[key]).split("|");

    for (const rule of rules) {
      const [ruleName, param] = rule.trim().split(":");

      switch (ruleName) {
        case "required":
          if (!isExists(value) || validator.isEmpty(String(value || ""))) {
            errors.push({ field: key, message: `${key} is required` });
          }
          break;

        case "isEmail":
          if (isExists(value) && !validator.isEmail(String(value))) {
            errors.push({
              field: key,
              message: `${key} must be a valid email`,
            });
          }
          break;

        case "isStrongPassword":
          if (isExists(value) && !validator.isStrongPassword(String(value))) {
            errors.push({
              field: key,
              message: `${key} must be at least 8 characters, include uppercase, lowercase, number, and symbol`,
            });
          }
          break;

        case "minLength":
          if (isExists(value) && String(value).length < Number(param)) {
            errors.push({
              field: key,
              message: `${key} must be at least ${param} characters`,
            });
          }
          break;

        case "maxLength":
          if (isExists(value) && String(value).length > Number(param)) {
            errors.push({
              field: key,
              message: `${key} must be at most ${param} characters`,
            });
          }
          break;

        case "isNumeric":
          if (isExists(value) && !validator.isNumeric(String(value))) {
            errors.push({ field: key, message: `${key} must be numeric` });
          }
          break;

        default:
          break;
      }
    }
  }

  return {
    errors,
    data,
  };
};

export { dataValid };
