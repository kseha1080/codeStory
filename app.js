const express = require('express');
const exphbs = require('express-handlebars')
const path = require('path')
const mongoose = require('mongoose');
//var cookieParser = require('cookie-parser')
const session = require('express-session');
const passport = require('passport');


//load user model
require('./models/User');

//passport config
require('./config/passport')(passport);

//load router
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');


//log keys
const keys = require('./config/keys')

//map global promises
mongoose.Promise = global.Promise;
//mongoose connect
mongoose.connect(keys.mongoURI, {
  //useMongoClient: true
}).then(() => console.log('mongoDB connected'))
.catch(err => console.log(err));

const app = express();

//HandleBars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//set global vars
app.use((req, res, next)=>{
  res.locals.user = req.user || null;
  next();
});

//set static folder
app.use(express.static(path.join(__dirname, 'public')));
//use routes
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);





const port = process.env.PORT || 5000;

app.listen(port, () =>{
  console.log('you are in port ' +port)
})