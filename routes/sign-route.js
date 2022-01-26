const express = require("express");
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  loginGoogle,
} = require("../controllers/sign-controller");
const { validate } = require("../middlewares/validator");
const { registerSchema, loginSchema } = require("../helpers/joi-schema");
const passport = require('passport')
require('../helpers/passport');

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
  }),
  loginGoogle
);

module.exports = router;
