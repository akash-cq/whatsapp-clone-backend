const { rateLimit } = require("express-rate-limit");
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 4, // each IP can make up to 10 requests per `windowsMs` (5 minutes)
  standardHeaders: true, // add the `RateLimit-*` headers to the response
  legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
});
const msgLimit = rateLimit({
  windowMs: 1000, // 5 minutes
  limit: 10, // each IP can make up to 10 requests per `windowsMs` (5 minutes)
  standardHeaders: true, // add the `RateLimit-*` headers to the response
  legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
});
module.exports = { loginLimiter, msgLimit };