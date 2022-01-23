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
            [Op.like]: `%${keyword}%`,
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
          first = moment().startOf("day").toDate();
          last = moment().endOf("day").toDate();
          dateRange = {
            datetime: {
              [Op.between]: [first, last],
            },
          };
          break;
        case "week":
          first = moment().startOf("week").toDate();
          last = moment().endOf("week").toDate();
          dateRange = {
            datetime: {
              [Op.between]: [first, last],
            },
          };
          break;
        case "month":
          first = moment().startOf("month").toDate();
          last = moment().endOf("month").toDate();
          dateRange = {
            datetime: {
              [Op.between]: [first, last],
            },
          };
          break;
        case "year":
          first = moment().startOf("year").toDate();
          last = moment().endOf("year").toDate();
          dateRange = {
            datetime: {
              [Op.between]: [first, last],
            },
          };
          break;
        case "tomorrow":
          first = moment().endOf("day");
          last = moment().add(1, "day").endOf("day");
          console.log(first, last);
          dateRange = {
            datetime: {
              [Op.between]: [first, last],
            },
          };
          break;
      }

      // filter by category
      let cat;
      switch (category) {
        case "photography":
          cat = {
            category_id: "1",
          };
          break;
        case "design":
          cat = {
            category_id: "2",
          };
          break;
        case "development":
          cat = {
            category_id: "3",
          };
          break;
        case "marketing":
          cat = {
            category_id: "4",
          };
          break;
        case "business":
          cat = {
            category_id: "5",
          };
          break;
        case "lifestyle":
          cat = {
            category_id: "6",
          };
          break;
        case "music":
          cat = {
            category_id: "7",
          };
          break;
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
          },
        ],
        where: {
          ...dateRange,
          ...cat,
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
};
