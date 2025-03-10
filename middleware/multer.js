const { error } = require("console");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!file)  return cb(false, false);
    if (file.fieldname == "dp") cb(null, "./uploads/profileDp");
    else if (file.fieldname == "msgFile") {
      cb(null, "./uploads/msgFiles");
    }
  },
  filename: function (req, file, cb){
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
})
const fileFilter = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(file.mimetype))
      return cb(false, false);
    cb(null, true);
}
const upload = multer({ storage: storage,fileFilter:fileFilter });
module.exports = upload;
