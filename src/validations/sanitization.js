import validator from "validator";

const sanitization = (data) => {
  const obj = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value !== "string") {
      obj[key] = value; // biarkan data non-string (misalnya angka/boolean)
      continue;
    }

    if (key === "password") {
      obj[key] = validator.trim(value);
    } else {
      obj[key] = validator.escape(validator.trim(value));
    }
  }
  return obj;
};

const isExists = (v) => v !== undefined && v !== null;

export { sanitization, isExists };
