require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');


const authRouter = require('./routes/auth.routes');


// configuration ===============================================================
mongoose.connect('mongodb+srv://admin:admin@cluster0.v7yzg.mongodb.net/webdulich?retryWrites=true&w=majority', {useNewUrlParser: true, useNewUrlParser: true,  useUnifiedTopology: true}, function(err){
    if(err){
        console.log("Khong the ket noi "+ err)
    }else{
        console.log("Ket noi thanh cong ")
    }
}); // kết nối tới db


// cài đặt ứng dung express
app.use(morgan('dev')); // log tất cả request ra console log
app.use(cookieParser()); // đọc cookie (cần cho xác thực)
app.use(bodyParser.json()); // lấy thông tin từ html forms
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash()); // use connect-flash for flash messages stored in session

app.set('view engine', 'ejs'); // cài đặt ejs là templating

// các cài đặt cần thiết cho passport
app.use(session({
        secret: 'tienanh',
        cookie: {maxAge: 60000},
        resave: true,
        saveUninitialized: true
    }
)); // chuối bí mật đã mã hóa coookie
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// routes ======================================================================
app.use(authRouter);

require('./config/passport')(passport); // pass passport for configuration
// launch ======================================================================


app.listen(port);
console.log('The magic happens on port ' + port);