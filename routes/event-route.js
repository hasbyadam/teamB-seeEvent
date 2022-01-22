const express = require("express");
const router = express.Router();
const { getEvents, getEvent } = require("../controllers/event-controller");

router.get("/", getEvents);
router.get("/:id", getEvent);

module.exports = router