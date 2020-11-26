const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs')

// định nghĩa cấu trúc admin
const adminSchema = mongoose.Schema({
    admin: {
        email: String,
        password: String,
        role: Number
    }
});


// kiểm tra password có hợp lệ không
adminSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.admin.password);
};

module.exports = mongoose.model('Admin', adminSchema);