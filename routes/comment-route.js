const express = require("express");
const router = express.Router();
const { isLogin } = require("../middlewares/auth");
const {
  postComment,
  getComment,
} = require("../controllers/comment-controller");
const { validate } = require("../middlewares/validator");
const { postComments } = require("../helpers/joi-schema");

router.post("/", isLogin, validate(postComments), postComment);
router.get("/:id", getComment);

module.exports = router;
