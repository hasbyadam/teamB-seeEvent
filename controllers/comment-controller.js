const Joi = require("joi");
const { Comment, Users, Event } = require("../models");
const catchError = require("../utils/error");

module.exports = {
  postComment: async (req, res) => {
    const body = req.body;
    const id = req.params.id;
    try {
      const schema = Joi.object({
        description: Joi.string().required(),
        user_id: Joi.number().required(),
        event_id: Joi.number().required(),
      });

      const { error } = schema.validate({
        ...body,
        user_id: req.user.id,
        event_id: id,
      });
      if (error) {
        return res.status(400).json({
          status: "Bad Request",
          message: error.message,
        });
      }
      const data = await Comment.create({
        ...body,
        user_id: req.user.id,
        event_id: id,
      });
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
