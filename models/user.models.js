const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({

  email: {
    type: String,
    required: false
    },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: false
  },
  // role: {
  //   type: Number,
  //   required: false,
  //   default: 0
  // },
  // isAuthenticated: {
  //   type: Boolean,
  //   required: false,
  //   default: false
  // },
  // cart: {
  //   type: Object,
  //   required: false
  // }
});

// methods ======================
//phương thực sinh chuỗi hash
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// kiểm tra password có hợp lệ không
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
