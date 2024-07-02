import jwt from "jsonwebtoken";
const authenticate = (req, res, next) => {
  const token =
    req.cookies?.accessToken || req.header("Authorization")?.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

export { authenticate };
