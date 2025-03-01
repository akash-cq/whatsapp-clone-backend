const fs = require("fs");
const path = require("path");
const readline = require("readline");
const static = (folderName) => {
  return (req, res, next) => {
    console.log(req.url);
    const dirName = path.join(folderName, req.url);
    console.log(req.url);
    const file = fs.createReadStream(dirName);
    file.pipe(res);
  };
};
module.exports = static;
