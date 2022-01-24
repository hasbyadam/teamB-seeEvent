const express = require("express");
const router = express.Router();
const {
  getEvents,
  getEvent,
  createEvent,
} = require("../controllers/event-controller");
const { postEvent } = require("../helpers/joi-schema");
const { isLogin } = require("../middlewares/auth");
const { uploadCloud } = require("../middlewares/upload-image");
const { validateImage } = require("../middlewares/validator");

router.get("/", getEvents);
router.get("/:id", getEvent);
router.post(
  "/",
  isLogin,
  uploadCloud("image"),
  validateImage(postEvent),
  createEvent,
);

module.exports = router;
