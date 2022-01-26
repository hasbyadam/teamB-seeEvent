const express = require("express");
const router = express.Router();
const { isLogin } = require("../middlewares/auth");
const {
  createBookmark,
  getBookmarks,
} = require("../controllers/bookmark-controller");

router.post("/:id", isLogin, createBookmark);
router.get("/", isLogin, getBookmarks);

module.exports = router;
