const express = require("express");
const router = express.Router();
const { fetchAccountInfo } = require("../controllers/account-controller");
const { isLogin }  = require('../middlewares/auth')

router.get('/', isLogin, fetchAccountInfo)

module.exports = router