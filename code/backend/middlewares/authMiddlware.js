const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({ message: "Authorization header missing or malformed", success: false });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Token is not valid", success: false });
      } else {
        req.body.userId = decoded.id;
        next();
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error", success: false });
  }
};
