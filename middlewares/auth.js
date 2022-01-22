const { Users } = require("../models");
const jwt = require("jsonwebtoken");

module.exports = {
  isLogin: async (req, res, next) => {
    try {
      let token = req.header("Authorization");
      if (!token) {
        return res.status(401).json({
          status: "Unauthorized",
          message: "No token detected",
        });
      }
      token = token.replace("Bearer ", "");
      const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
      const user = await Users.findOne({
        where: {
          id: decoded.id,
        },
      });
      if (!user) {
        return res.status(401).json({
          status: "Unauthorized",
          message: "User not found",
        });
      }
      req.user = {
        id: user.id,
        email: user.email,
      };
      next();
    } catch (error) {
      next(error);
    }
  },
};
