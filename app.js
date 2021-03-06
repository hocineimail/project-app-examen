const express = require('express');
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash"); 
const passport = require("passport");

mongoose.connect("mongodb://localhost:27017/projectexams");
var helmet = require('helmet');
// routes
var routes = require('./routes/routes')
var user = require('./routes/user')
var admin = require('./routes/admin')
var setUpPassport = require('./routes/setuppassport')

let student = require('./student_routes/student')
let certificate = require('./student_routes/certificate')
app.use(helmet())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  )

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type,x-auth'
  )

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true)

  // Pass to next layer of middleware
  next()
})

setUpPassport()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(
  session({
    secret: 'TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX',
    resave: true,
    saveUninitialized: true,

          

  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//using folder views
app.use(express.static(__dirname + '/public'))
app.engine('ejs', require('ejs').renderFile)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// using routes
app.use(user)
app.use(routes)
app.use(admin)

app.use('/student', student)
app.use('/certificate', certificate)
app.post(
  '/login',
  passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
)
app.use(express.static(__dirname + '/client/build'))
app.get('/studenthome', ensureAuthenticated,(req, res) => {
  res.sendFile(__dirname + '/client/build/index.html')
})
app.get('/studenthome/*', ensureAuthenticated,(req, res) => {
  res.sendFile(__dirname + '/client/build/index.html')
})
app.get('/siginstudent/*', ensureAuthenticated,(req, res) => {
  res.sendFile(__dirname + '/client/build/index.html')
})
app.get('/exampage', ensureAuthenticated,(req, res) => {
  res.sendFile(__dirname + '/client/build/index.html')
})
app.get('/exampage/*', ensureAuthenticated,(req, res) => {
  res.sendFile(__dirname + '/client/build/index.html')
})
app.get("/404", (req,res) => {
  res.render("404")
})

app.get('*', function(req, res){
  res.redirect("/404")
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
  next();
  } else {
 
  res.redirect("/");
  }
 }
app.listen(3000, () => {
  console.log('Server listing on 3000')
})
