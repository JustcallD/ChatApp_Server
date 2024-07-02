const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).send({ error: "Access denied." });
  }
  next();
};

export { authorize };
