const Tours = require("../models/tour.models");
const Categories = require("../models/ourCategory.models");
const Cart = require("../models/cart.models");
var Users = require("../models/user.models");
const Order = require("../models/order.models");

var ITEM_PER_PAGE = 12;
var SORT_ITEM;
var sort_value = "Giá thấp tới cao";
var ptype;
var ptypesub;
var pprice = 999999;
var psize;
var plabel;
var plowerprice;
var price;
var searchText;

exports.getIndexTours = (req, res, next) => {
  var cartTour;
  if (!req.session.cart) {
    cartTour = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartTour = cart.generateArray();
  }

  Tours.find()
    .limit(8)
    .then(tours => {
      Tours.find()
        .limit(8)
        .sort("buyCounts")
        .then(tours2 => {
          res.render("index", {
            title: "Trang chủ",
            user: req.user,
            trendings: tours,
            hots: tours2,
            cartTour: cartTour
          });
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getTour = (req, res, next) => {
  var cartTour;
  if (!req.session.cart) {
    cartTour = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartTour = cart.generateArray();
  }
  const tourId = req.params.tourId;
  Tours.findOne({ _id: `${tourId}` }).then(tour => {
    Tours.find({ "tourType.main": tour.tourType.main }).then(
      relatedTours => {
        res.render("tour", {
          title: `${tour.name}`,
          user: req.user,
          tour: tour,
          comments: tour.comment.items,
          allComment: tour.comment.total,
          cartTour: cartTour,
          relatedTours: relatedTours
        });
        tour.save();
      }
    );
  });
};

exports.getTours = (req, res, next) => {
  var cartTour;
  if (!req.session.cart) {
    cartTour = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartTour = cart.generateArray();
  }
  let tourType = req.params.tourType;
  let tourChild = req.params.tourChild;

  ptype = req.query.type !== undefined ? req.query.type : ptype;
  ptypesub = req.query.type !== undefined ? req.query.type : ptypesub;
  pprice = req.query.price !== undefined ? req.query.price : 999999;
  psize = req.query.size !== undefined ? req.query.size : psize;
  plabel = req.query.label !== undefined ? req.query.label : plabel;
  plowerprice = pprice !== 999999 ? pprice - 50 : 0;
  plowerprice = pprice == 1000000 ? 200 : plowerprice;
  SORT_ITEM = req.query.orderby;

  if (SORT_ITEM == -1) {
    sort_value = "Giá cao tới thấp";
    price = "-1";
  }
  if (SORT_ITEM == 1) {
    sort_value = "Giá thấp tới cao";
    price = "1";
  }

  if (Object.entries(req.query).length == 0) {
    ptype = "";
    psize = "";
    plabel = "";
    ptypesub = "";
  }

  var page = +req.query.page || 1;
  let totalItems;
  let catName = [];
  Categories.find({}, (err, cats) => {
    cats.forEach(cat => {
      catName.push(cat.name);
    });
  });

  let childType;
  if (tourType == undefined) {
    tourType = "";
  } else {
    Categories.findOne({ name: `${tourType}` }, (err, data) => {
      if (err) console.log(err);
      if (data) {
        childType = data.childName || "";
      } else {
        childType = "";
      }
    });
  }

  if (tourChild == undefined) {
    tourChild = "";
  }

  Tours.find({
    "tourType.main": new RegExp(tourType, "i"),
    "tourType.sub": new RegExp(tourChild, "i"),
    price: { $gt: plowerprice, $lt: pprice },
    labels: new RegExp(plabel, "i")
  })
    .countDocuments()
    .then(numTour => {
      totalItems = numTour;
      return Tours.find({
        "tourType.main": new RegExp(tourType, "i"),
        "tourType.sub": new RegExp(tourChild, "i"),
        price: { $gt: plowerprice, $lt: pprice },
        labels: new RegExp(plabel, "i")
      })
        .skip((page - 1) * ITEM_PER_PAGE)
        .limit(ITEM_PER_PAGE)
        .sort({
          price
        });
    })
    .then(tours => {
      res.render("tours", {
        title: "Danh sách sản phẩm",
        user: req.user,
        allTours: tours,
        currentPage: page,
        categories: catName,
        currentCat: tourType,
        currentChild: tourChild,
        categoriesChild: childType,
        hasNextPage: ITEM_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEM_PER_PAGE),
        ITEM_PER_PAGE: ITEM_PER_PAGE,
        sort_value: sort_value,
        cartTour: cartTour
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postNumItems = (req, res, next) => {
  ITEM_PER_PAGE = parseInt(req.body.numItems);
  res.redirect("back");
};

exports.getSearch = (req, res, next) => {
  var cartTour;
  if (!req.session.cart) {
    cartTour = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartTour = cart.generateArray();
  }
  searchText =
    req.query.searchText !== undefined ? req.query.searchText : searchText;
  const page = +req.query.page || 1;

  Tours.createIndexes({}).catch(err => {
    console.log(err);
  });
  Tours.find({
    $text: { $search: searchText }
  })
    .countDocuments()
    .then(numTour => {
      totalItems = numTour;
      return Tours.find({
        $text: { $search: searchText }
      })
        .skip((page - 1) * 12)
        .limit(12);
    })
    .then(tours => {
      res.render("search-result", {
        title: "Kết quả tìm kiếm cho " + searchText,
        user: req.user,
        searchTours: tours,
        searchT: searchText,
        currentPage: page,
        hasNextPage: 12 * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / 12),
        cartTour: cartTour
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postComment = (req, res, next) => {
  const tourId = req.params.tourId;
  var tname;
  if (typeof req.user === "undefined") {
    tname = req.body.inputName;
  } else {
    tname = req.user.username;
  }
  Tours.findOne({
    _id: tourId
  }).then(tour => {
    var today = new Date();
    tour.comment.items.push({
      title: req.body.inputTitle,
      content: req.body.inputContent,
      name: tname,
      date: today,
      star: req.body.rating
    });
    tour.comment.total++;
    tour.save();
  });
  res.redirect("back");
};

exports.getCart = (req, res, next) => {
  var cartTour;
  if (!req.session.cart) {
    cartTour = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartTour = cart.generateArray();
  }
  res.render("shopping-cart", {
    title: "Giỏ hàng",
    user: req.user,
    cartTour: cartTour
  });
};

exports.addToCart = (req, res, next) => {
  var tourId = req.params.tourId;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Tours.findById(tourId, (err, tour) => {
    if (err) {
      return res.redirect("back");
    }
    cart.add(tour, tourId);
    req.session.cart = cart;
    if (req.user) {
      req.user.cart = cart;
      req.user.save();
    }
    res.redirect("back");
  });
};

exports.modifyCart = (req, res, next) => {
  var tourId = req.query.id;
  var qty = req.query.qty;
  if (qty == 0) {
    return res.redirect("back");
  }
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Tours.findById(tourId, (err, tour) => {
    if (err) {
      return res.redirect("back");
    }
    cart.changeQty(tour, tourId, qty);
    req.session.cart = cart;
    if (req.user) {
      req.user.cart = cart;
      req.user.save();
    }
    res.redirect("back");
  });
};

exports.getDeleteCart = (req, res, next) => {
  req.session.cart = null;
  if (req.user) {
    req.user.cart = {};
    req.user.save();
  }
  res.redirect("back");
};

exports.getDeleteItem = (req, res, next) => {
  var tourId = req.params.tourId;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Tours.findById(tourId, (err, tour) => {
    if (err) {
      return res.redirect("back");
    }
    cart.deleteItem(tourId);
    req.session.cart = cart;
    if (req.user) {
      req.user.cart = cart;
      req.user.save();
    }
    console.log(req.session.cart);
    res.redirect("back");
  });
};

exports.addOrder = (req, res, next) => {
  var cartTour;
  if (!req.session.cart) {
    cartTour = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartTour = cart.generateArray();
  }
  res.render("add-address", {
    title: "Thông tin giao hàng",
    user: req.user,
    cartTour: cartTour
  });
};

exports.postAddOrder = async (req, res, next) => {
  console.log(req.session.cart);
  if (req.session.cart.totalQty) {
    var order = new Order({
      user: req.user,
      cart: req.session.cart,
      address: req.body.address,
      phoneNumber: req.body.phone
    });

    for (var id in req.session.cart.items) {
      await Tours.findOne({ _id: id })
        .then(tour => {
          tour.buyCounts += parseInt(req.session.cart.items[id].qty);
          tour.save();
        })
        .catch(err => console.log(err));
    }

    order.save((err, result) => {
      req.flash("success", "Thanh toán thành công!");
      req.session.cart = null;
      req.user.cart = {};
      req.user.save();
      res.redirect("/account");
    });
  } else {
    req.flash("error", "Giỏ hàng rỗng!");
    res.redirect("/account");
  }
};

exports.mergeCart = (req, res, next) => {
  if (req.user.cart != {} && req.user.cart) {
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart = cart.addCart(req.user.cart);
    req.session.cart = cart;
    req.user.cart = cart;
    req.user.save();
  }
  res.redirect("/");
};
