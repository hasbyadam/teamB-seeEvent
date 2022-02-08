const express = require("express");
const router = express.Router();
const { isLogin } = require("../middlewares/auth");
const {
  postComment,
  getComment,
} = require("../controllers/comment-controller");

router.post("/:id", isLogin, postComment);
router.get("/:id", getComment);

module.exports = router;
