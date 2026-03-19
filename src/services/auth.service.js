import User from "../models/user.model.js";
import { hashPassword, comparePassword } from "../utils/hash.js";

export const registerUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("User already exists");

  const hashed = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashed,
  });

  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("User not found");

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) throw new Error("Invalid credentials");

  return user;
};