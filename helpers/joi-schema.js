const Joi = require("joi").extend(require("@joi/date"));

module.exports = {
  registerSchema: Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(5)
      .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[a-z])/)
      .message(
        '"password" should contain a mix of uppercase and lowercase letters, numbers, and special characters ',
      )
      .required(),
  }),
  loginSchema: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};
