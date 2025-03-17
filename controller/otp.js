const { setAssign } = require("../middleware/auth");
const Otp = require("../model/otp");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const transporter = require("../middleware/nodemailer");
async function otpGen(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "email is empty" });
    const user = await User.findOne({ email: email });
    if (!user) return res.status(404).json({ msg: "404 user not found" });
    const otp = Math.floor(Math.random() * 9999);
    const otpSchema = new Otp({
      email: email,
      otp: otp,
      userid: user._id,
    });
    await otpSchema.save();
    const payload = {
      email: email,
      id: otpSchema._id,
      userid: user._id,
    };
    setAssign(req, res, payload);
    const mailOptions = {
      from: "akash.2024dev@gmail.com",
      to: email,
      subject: "Forget The password",
      text: `Your OTP(ONE TIME PASSWORD ) is ${otp} valid for only 2 minutes`,
      html: `<div>Your OTP(ONE TIME PASSWORD ) is ${otp} valid for only 2 minutes or you can click on this <a href="http://localhost:5173/forgetPass/password/${payload.id}">link</a> to skip otp verification</div>`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
        return res.status(200).json({ msg: "wrong email" });
      } else {
        console.log("Email sent: " + info.response);
      }
      return res.status(200).json({ msg: "otp send", id: payload.id });
    });
    console.log(user);
    return res.status(200).json({ msg: "otp generated ", id: payload.id });
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
    return res.status(200).json({ msg: "success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "internal error" });
  }
}
async function Passwordreset(req, res) {
  try {
    const { password } = req.body;
    const { id } = req.params;

    console.log(id);
    const salt = await bcrypt.genSalt(10);
    const hashP = await bcrypt.hash(password, salt);
    const otp = await Otp.findById(id);
    const user = await User.findById(otp.userid);
    console.log(user);
    user.password = hashP;
    await user.save();
    await Otp.findByIdAndDelete(id);
    res.clearCookie("token");

    return res.status(200).json({ msg: "success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "internal error" });
  }
}
module.exports = { otpGen, otpverify, Passwordreset };
