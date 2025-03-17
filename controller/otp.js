const { setAssign } = require("../middleware/auth");
const Otp = require("../model/otp");
const User = require("../model/user");
const bcrypt = require("bcrypt");

async function otpGen(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "email is empty" });
    const user = await User.find({ email: email });
    if (!user) return res.status(404).json({ msg: "404 user not found" });
    const otp = Math.floor(Math.random() * 9999)
    const otpSchema = new Otp({
      email: email,
      otp: otp,
    });
    await otpSchema.save();
    const payload = {
      email: email,
      id: otpSchema._id,
    };
    setAssign(req, res, payload);

    return res.status(200).json({ msg: "otp generated ", otp });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "internal error" });
  }
}
async function otpverify(req, res) {
  try {
    const { email, id } = req.obj;
    const { otp } = req.body;
    const user = await Otp.findById(id);
    if (!(user.otp == otp && user.email == email))
      return res.status(400).json({ msg: "otp is wrong" });
    Otp.findByIdAndDelete(id);
    return res.status(200).json({ msg: "success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "internal error" });
  }
}
async function Passwordreset(req, res) {
  try {
    const { password } = req.body;
    const { email } = req.obj;
    console.log(req.obj)
    const salt = await bcrypt.genSalt(10);
    const hashP = await bcrypt.hash(password, salt);
    const user = await User.findOne({ email: email });
    console.log(user)
    user.password = hashP;
    await user.save();
    res.clearCookie("token");

    return res.status(200).json({ msg: "success" });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: "internal error" });
  }
}
module.exports = { otpGen, otpverify, Passwordreset };
