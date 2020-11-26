const authController = require("../controllers/auth.controller");
module.exports = function (app) {

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', authController.logout);
};