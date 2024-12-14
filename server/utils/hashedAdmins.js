const bcrypt = require("bcryptjs");
const salt = 10;

const hashedPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

const hashedPasswordForAdmins = async (admins) => {
  const hashedAdmins = await Promise.all(
    admins.map(async (admin) => {
      const hashPassword = await hashedPassword(admin.password);
      return { ...admin, password: hashPassword };
    })
  );
  return hashedAdmins;
};

module.exports = { hashedPasswordForAdmins };
