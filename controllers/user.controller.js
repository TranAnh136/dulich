const Users = require("../models/user");
const Cart = require("../models/cart");
const Order = require("../models/order");

exports.getAccount = (req, res, next) => {
  var cartTour;
  if (!req.session.cart) {
    cartTour = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartTour = cart.generateArray();
  }
  const messageSucc = req.flash("success")[0];
  const messageError = req.flash("error")[0];
  Order.find({ user: req.user }).then(order => {
    res.render("account", {
      title: "Thông tin tài khoản",
      user: req.user,
      cartTour: cartTour,
      order: order,
      messageSucc: messageSucc,
      messageError:messageError
    });
  });
};

exports.getAccountChange = (req, res, next) => {
  var cartTour;
  if (!req.session.cart) {
    cartTour = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartTour = cart.generateArray();
  }
  res.render("account-change-info", {
    title: "Thay đổi thông tin tài khoản",
    user: req.user,
    cartTour: cartTour
  });
};

exports.postAccountChange = (req, res, next) => {

  req.user.email = req.body.email;
  req.user.username = req.body.username;
  req.user.address = req.body.address;
  req.user.phoneNumber = req.body.phoneNumber;
  req.user.save();
  res.redirect("/account");
};
