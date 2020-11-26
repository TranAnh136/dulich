
const authController = require('../controllers/auth.controller');

module.exports = function (app, passport) {

  


    // Hiển thị form login
    app.get('/signup', authController.getSignUp);

      // Xử lý thông tin khi có người thực hiện đăng nhập
      app.post('/signup', authController.postSignUp)


};