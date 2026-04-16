import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/userModel.js";
import { sendEmail } from "../utils/emailService.js";
import { generateAccessToken, generateRefreshToken } from "../core/JWT.js";

export const register = async (req: any, res: any) => {

  const { username, email, password, role, phone } = req.body;

  const isStrongPassword = (password: string): boolean => {
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/.test(password);
  };
  if (!isStrongPassword(password)) {
    return res.status(400).json({
      message: "Password must contain uppercase, number & special character"
    });
  }

  let user;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      phone,
      is_verified: false
    });


  } catch (error: any) {

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "email already exists" });
    }
    return res.status(500).json({ message: "user creation failed" });
  }

  let token;
  try {
    token = jwt.sign(
      { id: user.user_id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );
  }
  catch {
    return res.status(500).json({ message: "Token generation failed" });

  }

  try {
    const verifyLink = `http://localhost:3000/api/auth/verify-email?token=${token}`
    //const verifyLink = `http://localhost:5173/verify-email?token=${token}`;

    await sendEmail(
      email,
      "Verify Your Email",
      `
      <h2>Email Verification</h2>
      <p>Click below to verify your email:</p>
      <a href="${verifyLink}" style="padding:10px;background:blue;color:white;text-decoration:none;">
        Verify Email
      </a>
      `
    );
  }

  catch {
    return res.status(500).json({ message: "Email sending failed" });
  }

  return res.status(201).json({
    message: "User registered. Please verify your email"
  });

};


export const verifyEmail = async (req: any, res: any) => {
  try {
    const { token } = req.query;

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(400).json({
        message: "Invalid verification token"
      });
    }

    user.is_verified = true;
    await user.save();

    return res.status(200).json({
      message: "Email verified successfully"
    });

  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({
        message: "Verification link has expired"
      });
    }

    return res.status(400).json({
      message: "Invalid verification token"
    });
  }
};




export const login = async (req: any, res: any) => {

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "invalid credentials"
      });
    }

    if (!user.is_verified) {
      return res.status(403).json({
        message: "Verify your email first"
      });
    }


    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await User.update(
      { refresh_token: hashedRefreshToken },
      { where: { user_id: user.user_id } }
    );

    return res.status(200).json({
      message: "login successfully",
      accessToken,
      refreshToken
    });

  }



  catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};


export const logout = async (req: any, res: any) => {
  try {

    const user = await User.findByPk(req.user.id)

    if (!user) {
      return res.status(404).json({
        message: "user not found"
      })
    }

    user.refresh_token = null
    await user.save()

    res.json({
      message: "logout successful"
    })

  }
  catch (error) {
    res.status(500).json({
      message: "logout failed"
    })
  }
}



export const forgotPassword = async (req: any, res: any) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(200).json({
        message: "If the email exists, a reset link has been sent"
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    console.log("Reset Token:", resetToken);

    user.reset_password_token = resetToken;
    user.reset_password_expiry = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();
    // const resetLink = `http://localhost:3000/api/auth/reset-password/${resetToken}`

    const resetLink = `http://192.168.1.107:5173/reset-password/${resetToken}`;

    await sendEmail(
      user.email,
      "Reset Your Password",
      `
      <h2>Reset Password</h2>
      <a href="${resetLink}" style="padding:10px;background:red;color:white;">
        Reset Password
      </a>
      <p>This link expires in 15 minutes.</p>
      `
    );

    return res.status(200).json({
      message: "Reset link sent"
    });

  } catch {
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};



export const resetPassword = async (req: any, res: any) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      where: { reset_password_token: token }
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid reset token"
      });
    }

    if (
      !user.reset_password_expiry ||
      user.reset_password_expiry < new Date()
    ) {
      return res.status(400).json({
        message: "Reset token has expired"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.reset_password_token = null;
    user.reset_password_expiry = null;

    await user.save();

    return res.status(200).json({
      message: "Password reset successful"
    });

  } catch {
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};


export const resendVerificationEmail = async (req: any, res: any) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.is_verified) {
      return res.status(400).json({
        message: "Email already verified"
      });
    }

    const token = jwt.sign(
      { id: user.user_id },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    );

    const verifyLink = `http://localhost:3000/api/auth/verify-email?token=${token}`;
    await sendEmail(user.email, "Verify Your Email", `
      <h2>Email Verification</h2>
      <a href="${verifyLink}">Verify Email</a>
    `);

    return res.status(200).json({
      message: "Verification email sent"
    });

  } catch {
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};


