import User from "../models/userModel.js";


export const getProfile = async (req: any, res: any) => {
  try {
    console.log("REQ.USER:", req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const user = await User.findOne({
      where: { user_id: req.user.id },
      attributes: [
        "user_id",
        "username",
        "email",
        "role",
        "phone",
        "is_verified",
        "created_at"
      ]
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      message: "Profile fetched successfully",
      user
    });

  } catch (error: any) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      message: "Something went wrong",
      error: error.message
    });
  }
};