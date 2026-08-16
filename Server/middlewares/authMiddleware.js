import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // Header se token lena
    const authHeader = req.headers.authorization;

    // Token exist karta hai ya nahi
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    // "Bearer TOKEN" me se sirf TOKEN nikalna
    const token = authHeader.split(" ")[1];

    // Token verify karna
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // User ki information request me store karna
    req.user = decoded;

    // Next controller par jaana
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;