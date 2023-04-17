import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) res.status(401);

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(403);
  }
};

export default verifyToken;
