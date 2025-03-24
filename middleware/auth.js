const jwt = require("jsonwebtoken");
const expiresInMs = 2 * 60 * 60 * 1000; // 2 hours

const map =new Map()
function setAssign(req, res, payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "2h",
  });
  map.set(payload.email, {
    val: token,
    expiry: Date.now() + expiresInMs,
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
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.obj = decode;
    next();
  } catch (err) {
    return res.status(500).json({ msg: "internal error", err });
  }
}
function isLogin(req, res, next) {
    try {
      const payload = {
        email: req.body.email,
        password: req.body.password,
      };
      const islog = map.get(payload.email);
      console.log(islog);
      if (!islog) return next();

      return res.status(400).json({ msg: "user already login" });
    } catch (err) {
      console.log(err)
      return res.status(500).json({ msg: "internal error", err });
    }
}

function verify(req, res) {
  // const header = req.headers["authorization"]
  // if(!header)return res.status(401).json({ msg: "Access denied" });
  const token = req.cookies.token;
  console.log("login");
  if (!token) return res.status(401).json({ msg: "Access denied" });
  console.log("login");

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return res.status(200).json({ msg: "verify" });
  } catch (err) {
    return res.status(500).json({ msg: "internal error", err });
  }
}
function logout(req,res,next){
    try{

        map.delete(req?.obj?.email)
        next();
    }catch(err){
      return res.status(500).json({ msg: "internal error", err });
    }
}
setInterval(() => {
    const now = Date.now();
    for (const [email, tokenData] of map) {
        if (tokenData.expiry < now) {
            userTokens.delete(email);
            console.log(`Token for user ${userId} expired and removed.`);
        }
    }
},  10000);
module.exports = { setAssign, authentication, isLogin, verify, logout };
