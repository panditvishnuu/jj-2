const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 5MB
});

const uploadImages = upload.array("images", 10);

module.exports = { uploadImages };
