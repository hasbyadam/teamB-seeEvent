const { Users } = require("../models");
const catchError = require("../utils/error");

//Basic Feature
module.exports = {
  fetchAccountInfo: async (req, res) => {
    try {
      const data = await Users.findByPk(req.user.id, {
        attributes: ["first_name", "last_name", "email", "image"],
      });
      res.status(200).json({
        status: "Success",
        message: "Profile Fetched",
        result: data,
      });
    } catch (error) {
      catchError(error, response);
    }
  },
};
