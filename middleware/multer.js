const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file);
    if (!file)
      return cb(new Error("File not found"), false);
    if(file.fieldname=="dp")
     cb(null, "./uploads/profileDp");
    else if(file.fieldname=="msgFile"){
      cb(null, "./uploads/msgFiles");
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
module.exports = upload;