const Joi = require("joi");
const { Bookmark, Users, Event, Category } = require("../models");
const catchError = require("../utils/error");

module.exports = {
  createBookmark: async (req, res) => {
    const { id } = req.params;
    const { user } = req;
    try {
      const schema = Joi.object({
        user_id: Joi.number().required(),
        event_id: Joi.number().required(),
      });

      const { error } = schema.validate({
        user_id: user.id,
        event_id: id,
      });
      if (error) {
        return res.status(400).json({
          status: "Bad Request",
          message: error.message,
        });
      }
      const data = await Bookmark.create({
        user_id: user.id,
        event_id: id,
      });
      if (!data) {
        return res.status(400).json({
          status: "Failed",
          message: "Failed to save the event",
          result: {},
        });
      }
      res.status(200).json({
        status: "Success",
        message: "Successfully save the event",
        result: data,
      });
    } catch (error) {
      catchError(error, res);
    }
  },
  getBookmarks: async (req, res) => {
    const { user } = req;
    try {
      const data = await Bookmark.findAll({
        where: { user_id: user.id },
        attributes: {
          exclude: ["createdAt", "updatedAt", "event_id", "user_id"],
        },
        include: [
          {
            model: Event,
            as: "event",
            attributes: {
              exclude: ["createdAt", "updatedAt", "user_id", "category_id"],
            },
            include: [
              {
                model: Users,
                as: "createdBy",
                attributes: ["first_name", "last_name", "email", "image"],
              },
              {
                model: Category,
                as: "category",
                attributes: ["name"],
              },
            ],
          },
          {
            model: Users,
            as: "user",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt", "password"],
            },
          },
        ],
      });

      if (data.length == 0) {
        return res.status(404).json({
          status: "Data Not Found",
          message: "Data is not found",
          result: {},
        });
      }
      res.status(200).json({
        status: "Success",
        message: "Success retrieve the data",
        result: data,
      });
    } catch (error) {
      catchError(error, res);
    }
  },
};
