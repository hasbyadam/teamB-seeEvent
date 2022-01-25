const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

module.exports = {
  uploadLocal: (fieldName) => {
    const storage = multer.memoryStorage();
    const upload = multer({ storage }).single(fieldName);
    return (req, res, next) => {
      upload(req, res, (err) => {
        if (err) {
          catchHandler(res, err);
        }
        next();
      });
    };
  },
  uploadCloud: (fieldName) => {
    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: (req, file) => {
        return {
          folder: fieldName,
          resource_type: "raw",
          public_id: Date.now() + " - " + file.originalname,
        };
      },
    });

    const fileFilter = (req, file, cb) => {
      if (!file.mimetype.includes("image")) {
        return cb(new Error("Please select image files only"), false);
      }
      cb(null, true);
    };

    const upload = multer({
      storage,
      fileFilter,
      limits: { fileSize: 1024 * 1024 * 2 },
    }).single(fieldName);

    return (req, res, next) => {
      upload(req, res, (err) => {
        if (err) {
          return res.status(400).json({
            status: "Bad Request",
            message: err.message,
            result: {},
          });
        }
        next();
      });
    };
  },
};
