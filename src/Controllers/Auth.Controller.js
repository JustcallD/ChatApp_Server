import User from "../Models/User.Model.js";
import AsyncHandler from "../Utils/AsyncHandler.js";
import ApiResponse from "../Utils/ApiResponse.js";
import ApiError from "../Utils/ApiError.js";
import { generateAccessToken } from "../Utils/AuthJWT.js";

const SignUpController = AsyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json(new ApiError(400, "Email and password are required"));
    // throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json(new ApiError(409, "Account already exists"));
  }

  const newUser = await User.create({
    username,
    email,
    password,
  });

  if (!newUser) {
    return res
      .status(400)
      .json(new ApiError(400, "something went wrong while creating user"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, newUser, "user created successfully"));
});

const loginController = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    return res
      .status(400)
      .json(new ApiError(400, "Email and password are required"));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json(new ApiError(404, "user not found"));
  }
  //   const isValidPassword = await ComparePass(password, user.password);
  if (password !== user.password) {
    return res.status(404).json(new ApiError(404, "wrong password"));
  }
  const loginUser = await User.findById(user._id).select("-password -tasks");

  const accessToken = generateAccessToken(loginUser);
  const options = {
    httpOnly: true,
    // sameSite: "None",
    // secure: true,
  };
  res.cookie("accessToken", accessToken, options);

  res.status(200).json(new ApiResponse(200, { loginUser, accessToken }));
});

const logoutController = (req, res) => {
  res.clearCookie("accessToken");

  res.status(200).json(new ApiResponse(200, "Logout successful"));
};
export { SignUpController, loginController, logoutController };
