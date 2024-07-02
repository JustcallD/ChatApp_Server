import jwt from "jsonwebtoken";

const generateRefreshToken = (user) => {
  try {
    const refreshToken = jwt.sign(
      {
        _id: user._id,
        role: user.role,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
    return refreshToken;
  } catch (error) {
    console.error("Error generating refresh token:", error.message);
    throw new Error("Error generating refresh token");
  }
};

const generateAccessToken = (user) => {
  try {
    const accessToken = jwt.sign(
      {
        _id: user._id,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
    return accessToken;
  } catch (error) {
    console.error("Error generating access token:", error.message);
    throw new Error("Error generating access token");
  }
};

export { generateRefreshToken, generateAccessToken  };
