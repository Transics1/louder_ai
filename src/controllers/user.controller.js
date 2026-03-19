export const getProfile = async (req, res) => {
  res.json({
    message: "User profile fetched successfully",
    user: req.user,
  });
};