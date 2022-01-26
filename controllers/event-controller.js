const { Event, Users, Category } = require("../models");
const moment = require("moment");
const { Op } = require("sequelize");
const catchError = require("../utils/error");
const Joi = require("joi").extend(require("@joi/date"));

module.exports = {
  getEvents: async (req, res) => {
    let { sort, date, category, page, limit, keyword } = req.query;
    try {
      // search
      let search;
      if (keyword) {
        search = {
          title: {
            [Op.iLike]: `%${keyword}%`,
          },
        };
      }

      // sorting by date & name
      let order;
      switch (sort) {
        case "date":
          order = [["createdAt", "DESC"]];
          break;
        case "name":
          order = [["title", "ASC"]];
          break;
        default:
          order = [["createdAt", "ASC"]];
      }

      // filter by date
      let dateRange;
      let first, last;
      switch (date) {
        case "today":
          first = moment().tz("UTC").startOf("day").toDate();
          last = moment().tz("UTC").endOf("day").toDate();
          dateRange = {
            datetime: {
              [Op.between]: [first, last],
            },
          };
          break;
        case "week":
          first = moment().tz("UTC").startOf("week").toDate();
          last = moment().tz("UTC").endOf("week").toDate();
          dateRange = {
            datetime: {
              [Op.between]: [first, last],
            },
          };
          break;
        case "month":
          first = moment().tz("UTC").startOf("month").toDate();
          last = moment().tz("UTC").endOf("month").toDate();
          dateRange = {
            datetime: {
              [Op.between]: [first, last],
            },
          };
          break;
        case "year":
          first = moment().tz("UTC").startOf("year").toDate();
          last = moment().tz("UTC").endOf("year").toDate();
          dateRange = {
            datetime: {
              [Op.between]: [first, last],
            },
          };
          break;
        case "tomorrow":
          first = moment().tz("UTC").endOf("day");
          last = moment().tz("UTC").add(1, "day").endOf("day");
          dateRange = {
            datetime: {
              [Op.between]: [first, last],
            },
          };
          break;
      }

      // filter by category
      let cat;
      if (category) {
        cat = {
          name: {
            [Op.iLike]: category,
          },
        };
      } else {
        cat = category;
      }

      // pagination
      if (!page) {
        page = 1;
      }

      // limit data
      let limitation;
      if (!limit) {
        limitation = 8;
      } else {
        limitation = Number(limit);
      }

      const events = await Event.findAll({
        limit: limitation,
        offset: (page - 1) * limitation,
        order: order,
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
            where: {
              ...cat,
            },
          },
        ],
        where: {
          ...dateRange,
          ...search,
        },
        attributes: {
          exclude: ["user_id", "createdAt", "updatedAt", "category_id"],
        },
      });
      if (events.length == 0) {
        return res.status(404).json({
          status: "Not Found",
          message: "The data is empty",
          result: [],
        });
      }
      res.status(200).json({
        status: "Success",
        message: "Successfully retrieve the data",
        result: events,
      });
    } catch (error) {
      catchError(error, res);
    }
  },
  getEvent: async (req, res) => {
    const { id } = req.params;
    try {
      const event = await Event.findOne({
        where: {
          id,
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
        attributes: {
          exclude: ["createdAt", "updatedAt", "user_id", "category_id"],
        },
      });
      if (!event) {
        return res.status(404).json({
          status: "Data Not Found",
          message: `Can't find a data with id ${id}`,
          result: {},
        });
      }
      res.status(200).json({
        status: "Success",
        message: "Successfully restieve the data",
        result: event,
      });
    } catch (error) {
      catchError(error, res);
    }
  },
  createEvent: async (req, res) => {
    try {
      const body = req.body;
      const file = req.file;
      const schema = Joi.object({
        title: Joi.string().required(),
        datetime: Joi.date().format("YYYY-MM-DD HH:mm:ss").required(),
        detail: Joi.string().required(),
        image: Joi.string().required(),
        user_id: Joi.number().required(),
        category_id: Joi.number().required(),
      });
      const { error } = schema.validate({
        ...body,
        image: file.path,
        user_id: req.user.id,
      });
      if (error) {
        return res.status(400).json({
          status: "Bad Request",
          message: error.message,
        });
      }
      const event = await Event.create({
        ...body,
        image: file.path,
        user_id: req.user.id,
      });
      if (!event) {
        return res.status(500).json({
          status: "Internal server error",
          message: "Failed to create the data",
          result: {},
        });
      }
      res.status(201).json({
        status: "Success",
        message: "Successfuly to create event",
        result: event,
      });
    } catch (error) {
      catchError(error, res);
    }
  },
  updateEvent: async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const file = req.file;
    try {
      const schema = Joi.object({
        title: Joi.string(),
        datetime: Joi.date().format("YYYY-MM-DD HH:mm:ss"),
        detail: Joi.string(),
        image: Joi.string(),
        user_id: Joi.number(),
        category_id: Joi.number(),
      });
      const { error } = schema.validate(body);
      if (error) {
        return res.status(400).json({
          status: "Bad Request",
          message: error.message,
        });
      }
      let update;
      if (!file) {
        update = await Event.update(
          { ...body },
          {
            where: {
              id,
              user_id: req.user.id,
            },
          },
        );
      } else {
        update = await Event.update(
          { ...body, image: file.path },
          {
            where: {
              id,
              user_id: req.user.id,
            },
          },
        );
      }
      if (update[0] != 1) {
        return res.status(500).json({
          status: "Internal server error",
          message: "Failed update the data / data not found",
          result: {},
        });
      }
      const event = await Event.findOne({
        where: {
          id,
        },
      });
      res.status(200).json({
        status: "Success",
        message: "successfuly update the data",
        result: event,
      });
    } catch (error) {
      catchError(error, res);
    }
  },
};
