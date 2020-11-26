const authController = require("../controllers/auth.controller");
var express = require("express");
var router = express.Router();

     // HOME PAGE (Với những link đăng nhập) 
    // router.get('/', authController.index); 

    // Đây là trang sẽ được bảo vệ, chỉ những người đã đăng nhập mới có thể xem được
    // Chúng ta sẽ sử dụng route middleware để kiểm tra xem người đó đã đăng nhập chưa
    // hàm isLoggedIn sẽ làm việc đó.
    router.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile.ejs', {
            user: req.user // Lấy thông tin user trong session và truyền nó qua template
        });
    });
    router.get("/login", authController.getLogin);

    router.post("/login", authController.postLogin);
    
    router.get("/logout", authController.getLogout);
    
    router.get("/create-account", authController.getSignUp);
    
    router.post("/create-account", authController.postSignUp);


    // route middleware để kiểm tra một user đã đăng nhập hay chưa?
function isLoggedIn(req, res, next) {
    // Nếu một user đã xác thực, cho đi tiếp
    if (req.isAuthenticated())
        return next();
    // Nếu chưa, đưa về trang chủ
    res.redirect('/');
}


module.exports = router;