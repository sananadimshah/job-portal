import JWT from "jsonwebtoken";

const userauth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    next("Auth Failed");
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    next("Auth Failed");
  }
};

export { userauth };
