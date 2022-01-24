const express = require("express");
const router = express.Router();
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
} = require("../controllers/event-controller");
const { postEvent, editEvent } = require("../helpers/joi-schema");
const { isLogin } = require("../middlewares/auth");
const { uploadCloud } = require("../middlewares/upload-image");
const { validateImage } = require("../middlewares/validator");

router.get("/", getEvents);
router.get("/:id", getEvent);
router.post("/", isLogin, uploadCloud("image"), createEvent);
router.put("/:id", isLogin, uploadCloud("image"), updateEvent);

module.exports = router;
