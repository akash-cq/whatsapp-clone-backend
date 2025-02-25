const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique:true,
  },
  password: {
    type: String,
    required: true,
  },
  dp:{
    type:String,
    default:null
  },
  about:{
    type:String,
    default:null
  }
});
const User = mongoose.model('user',userSchema);
module.exports = User