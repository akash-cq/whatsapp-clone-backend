const jwt = require("jsonwebtoken");
function setAssign(req, res, payload) {
  const token = jwt.sign(payload, "AKASH_GUPTA_@CODEQUOTIENT_@MAIMT_$100", {
    expiresIn: "2h",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
    maxAge: 2 * 60 * 60 * 1000, // 2 hours
  });
}
function authentication(req, res, next) {
  // const header = req.headers["authorization"]
  // if(!header)return res.status(401).json({ msg: "Access denied" });
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ msg: "Access denied" });
  try {
    const decode = jwt.verify(token, "AKASH_GUPTA_@CODEQUOTIENT_@MAIMT_$100");
    next();
  } catch (err) {
    return res.status(500).json({ msg: "internal error", err });
  }
}
function getData(req, res) {
  // const header = req.headers["authorization"];
  // if (!header) return res.status(401).json({ msg: "Access denied" });
  // const token = header.split("Bearer")[1]?.trim();
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ msg: "Access denied" });
  try {
    const decode = jwt.verify(token, "AKASH_GUPTA_@CODEQUOTIENT_@MAIMT_$100");
    return decode;
  } catch (err) {
    return res.status(500).json({ msg: "internal error", err });
  }
}

function verify(req, res) {
  // const header = req.headers["authorization"]
  // if(!header)return res.status(401).json({ msg: "Access denied" });
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ msg: "Access denied" });
  try {
    const decode = jwt.verify(token, "AKASH_GUPTA_@CODEQUOTIENT_@MAIMT_$100");
    return res.status(200).json({ msg: "verify" });
  } catch (err) {
    return res.status(500).json({ msg: "internal error", err });
  }
}
module.exports = { setAssign, authentication, getData, verify };
