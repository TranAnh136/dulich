
const authController = require('../controllers/auth.controller');

module.exports = function (router, passport) {

    // Xử lý thông tin khi có người thực hiện đăng nhập
    router.post('/login', passport.authenticate("local-login", {
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash : true
    }));


    // Hiển thị form login
    router.get('/login', authController.login);

    //=========================

     // Xử lý thông tin khi admin thực hiện đăng nhập
    //  app.post('/login1', passport.authenticate("admin-login", {
    //     successRedirect : '/admin',
    //     failureRedirect : '/login1',
    //     failureFlash : true
    // }));

    // // Hiển thị form login
    // app.get('/login1', controller.login);

};