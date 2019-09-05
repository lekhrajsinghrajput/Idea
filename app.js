const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const methodOverride = require('method-override');
const mongoURI = require('./config/database').mongoURI;


const app = express();

//load ideas routes
const ideasRoutes = require('./routes/ideas');
const usersRoutes = require('./routes/users');

//passport config
require('./config/passport')(passport);

//static setup
app.use(express.static(path.join(__dirname,'public')));



//body parser middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//method override middleware
app.use(methodOverride('_method'));

//express-session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));


//passport middleware(always put this after the session middleware)
app.use(passport.initialize());
app.use(passport.session());


//flash middleware
app.use(flash());

//global variables
app.use((req,res,next)=>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  //setting user to global variable
  res.locals.user = req.user || null;
  next();
})
//connect to database
mongoose.connect(mongoURI,{ useNewUrlParser: true })
  .then(()=> console.log('connected to mongodb'))
  .catch( err => console.log('error while conneting to mongodb'));



app.set('view engine','ejs');

//home page
app.get('/',(req,res)=>{
  res.render('index');
});

app.get('/about',(req,res)=>{
  res.render('about');
});

//use routes
app.use('/ideas',ideasRoutes);
app.use('/users',usersRoutes);

const port = process.env.PORT || 4000

app.listen(4000,()=>{
  console.log(`app started at port ${port}...`);
})