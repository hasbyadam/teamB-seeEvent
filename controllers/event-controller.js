const { Event, Users, Category } = require("../models");
const moment = require("moment");
const { Op } = require("sequelize");
const catchError = require("../utils/error");

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
            as: "created by",
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
            as: "created by",
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
      if (req.user.id != body.user_id) {
        return res.status(400).json({
          status: "Bad Request",
          message: "failed to create the data, id doesnt match with user_id",
          result: {},
        });
      }
      const event = await Event.create({
        ...body,
        image: file.path,
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
      return res.status(500).json({
        status: "Internal Server Error",
        message: error.message,
        result: {},
      });
    }
  },
};
