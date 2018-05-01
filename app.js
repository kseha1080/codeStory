const express = require('express');
const exphbs = require('express-handlebars')
const path = require('path')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session');
const passport = require('passport');


//load Modelss
require('./models/User');
require('./models/Story')

//passport config
require('./config/passport')(passport);

//load router
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');

//log keys
const keys = require('./config/keys')

//handlebars helpers
const {
  truncate,
  stripTags,
  select,
  editIcon
} = require('./helpers/hbs')




//map global promises
mongoose.Promise = global.Promise;
//mongoose connect
mongoose.connect(keys.mongoURI, {
  //useMongoClient: true
}).then(() => console.log('mongoDB connected'))
.catch(err => console.log(err));

const app = express();



//body-parse middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//method override middleware
app.use(methodOverride('_method'));


//HandleBars middleware
app.engine('handlebars', exphbs({
  helpers:{
    truncate: truncate,
    stripTags: stripTags,
    select: select,
    editIcon: editIcon
  },
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


// session middleware
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