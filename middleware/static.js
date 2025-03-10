const fs = require("fs");
const path = require("path");
const readline = require("readline");
const static = (folderName) => {
  return (req, res, next) => {
    const dirName = path.join(folderName, req.url);
    const file = fs.createReadStream(dirName);
    file.pipe(res);
  };
};
module.exports = static;
