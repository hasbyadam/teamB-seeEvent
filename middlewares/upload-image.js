const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

module.exports = {
  uploadCloud: (fieldName) => {
    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: (req, file) => {
        return {
          folder: fieldName,
          resource_type: "raw",
          public_id: Date.now() + "-" + file.originalname,
        };
      },
    });

    const upload = multer({ storage }).single(fieldName);
    return (req, res, next) => {
      upload(req, res, (error) => {
        if (error) {
          return res.status(500).json({
            status: "Internal server error",
            message: error.message,
          });
        }
        next();
      });
    };
  },
};
