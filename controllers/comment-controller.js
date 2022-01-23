const { Comment, Users, Event } = require("../models");
const catchError = require("../utils/error");

module.exports = {
  postComment: async (req, res) => {
    const body = req.body;
    try {
      if (req.user.id != body.user_id) {
        return res.status(400).json({
          status: "Bad Request",
          message:
            "failed to create the data, user.id doesnt match with user_id",
          result: {},
        });
      }

      const data = await Comment.create(body);
      if (!data) {
        return res.status(400).json({
          status: "Failed",
          message: "Failed to create comment",
          result: {},
        });
      }
      res.status(200).json({
        status: "Success",
        message: "Comment successfully created",
        result: data,
      });
    } catch (error) {
      catchError(error, res);
    }
  },

  getComment: async (req, res) => {
    try {
      const id = req.params.id;
      const data = await Comment.findAll({
        where: { event_id: id },
        include: [
          {
            model: Users,
            as: "users",
            attributes: ["first_name", "last_name", "image"],
          },
        ],
        order: [["createdAt", "ASC"]],
        attributes: ["id", "description", "createdAt"],
      });

      if (data) {
        return res.status(200).json({
          status: "Success",
          message: "Succesfully retrieve the data",
          result: data,
        });
      } else {
        return res.status(404).json({
          status: "Data Not Found",
          message: "Comment is not found",
          result: {},
        });
      }
    } catch (error) {
      catchError(error, res);
    }
  },
};
