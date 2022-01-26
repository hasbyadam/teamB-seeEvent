const express = require("express");
const router = express.Router();
const { fetchAccountInfo, uploadImage, editProfile, changePassword, deleteImage } = require("../controllers/account-controller");
const { isLogin } = require('../middlewares/auth')
const { validate } = require("../middlewares/validator")
const { editProfileSchema, editPasswordSchema } = require("../helpers/joi-schema")
const { uploadCloud } = require("../middlewares/upload-image")

router.get('/', isLogin, fetchAccountInfo)
router.post('/upload', isLogin, uploadCloud("image"), uploadImage)
router.put('/edit', isLogin, validate(editProfileSchema), editProfile)
router.put('/password', isLogin, validate(editPasswordSchema), changePassword)
router.post('/delete', isLogin, deleteImage)

module.exports = router