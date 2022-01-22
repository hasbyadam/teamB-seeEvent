const jwt = require("jsonwebtoken");
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const catchError = require("../utils/error");

module.exports = {
  register: async (req, res) => {
    const body = req.body;
    try {
      const check = await Users.findOne({
        where: {
          email: body.email,
        },
      });
      if (check) {
        return res.status(400).json({
          status: "Bad Request",
          message: "Email already exists",
        });
      }
      const hashedPassword = await bcrypt.hash(body.password, 10);
      const user = await Users.create({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        password: hashedPassword,
      });
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.SECRET_TOKEN,
        { expiresIn: "24h" },
      );
      res.status(200).json({
        status: "Success",
        message: "Successfully to create an account",
        result: token,
      });
    } catch (error) {
      catchError(error, Res);
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await Users.findOne({
        where: {
          email,
        },
      });
      if (!user) {
        return res.status(401).json({
          status: "Unauthorized",
          message: "Invalid email and password combination",
        });
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({
          status: "Unauthorized",
          message: "Invalid email and password combination",
          result: {},
        });
      }
      const token = jwt.sign(
        {
          email: user.email,
          id: user.id,
        },
        process.env.SECRET_TOKEN,
        { expiresIn: "24h" },
      );

      res.status(200).json({
        status: "Success",
        message: "Logged in successfully",
        result: {
          token,
        },
      });
    } catch (error) {
      catchError(error, res);
    }
  },
};
