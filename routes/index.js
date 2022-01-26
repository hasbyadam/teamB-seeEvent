const express = require("express");
const router = express.Router();

const accountRoute = require("./account-route");
const commentRoute = require("./comment-route");
const eventRoute = require("./event-route");
const signRoute = require("./sign-route");
const bookmarkRoute = require("./bookmark-route");

router.use("/account", accountRoute);
router.use("/comment", commentRoute);
router.use("/event", eventRoute);
router.use("/sign", signRoute);
router.use("/bookmark", bookmarkRoute);

module.exports = router;
