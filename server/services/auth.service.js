import bcrypt from "bcryptjs";

const AuthService = {
  hashPassword: async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },
  verifyPassword: async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
  },
};

export default AuthService;
