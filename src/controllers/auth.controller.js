import { registerUser, loginUser } from "../services/auth.service.js";
import { generateToken } from "../utils/token.js";

export const signup = async (req, res) => {
  try {
    const user = await registerUser(req.body);

    const token = generateToken(user._id);

    res.json({ user, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


export const login = async (req, res) => {
  try {
    const user = await loginUser(req.body);

    const token = generateToken(user._id);

    res.json({ user, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


export const logout = (req, res) => {
  res.json({ message: "Logged out successfully" });
};