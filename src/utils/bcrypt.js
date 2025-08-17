import bcrypt from "bcrypt";

const saltRounds = 10;

// Encrypt password (sync)
const encrypt = (password) => {
  return bcrypt.hashSync(password, saltRounds);
};

// Compare password (sync)
const compare = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

export { encrypt, compare };
