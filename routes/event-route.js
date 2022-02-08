const express = require("express");
const router = express.Router();
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
} = require("../controllers/event-controller");
const { isLogin } = require("../middlewares/auth");
const { uploadCloud } = require("../middlewares/upload-image");

router.get("/", getEvents);
router.get("/:id", getEvent);
router.post("/", isLogin, uploadCloud("image"), createEvent);
router.put("/:id", isLogin, uploadCloud("image"), updateEvent);

module.exports = router;
