if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const expressError = require('./utils/expresserror');
const methodOverride = require('method-override');
const engine = require('ejs-mate')
const reviewRoutes = require('./routes/reviews');
const campgroundRoutes = require('./routes/campgrounds');
const userRoutes = require('./routes/users');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrat = require('passport-local')
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const dbURL = process.env.DB_URL || 'mongodb://localhost:27017/yelpApp';
const MongoStore = require('connect-mongo');
const secret = process.env.SECRET || 'thisshouldbeabettersecret';
// 'mongodb://localhost:27017/yelpApp'

mongoose.connect(dbURL,{
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex :true,
    useFindAndModify : false

})
.then(() => {
    console.log('We are connected to mongo');
    // we're connected!
})
.catch(err => {
    console.log('oh no mongo errorr !');
    console.log(err);
    
})

app.engine('ejs',engine);
app.set('view engine','ejs');
app.set('views',path.join(__dirname , 'views'));
app.set('public',path.join(__dirname , 'public'));

app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'))
app.use(express.static('public'));
app.use(mongoSanitize());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUDNAME}/`, //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

const store = new MongoStore({
    mongoUrl : dbURL,
    secret : secret,
    touchAfter : 24 * 3600
})

app.use(session({
    store ,
    name : 'bleeeh',
    secret : secret,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now + (1000*60*60*24*7),
        // secure : true ,
        maxAge : (1000*60*60*24*7),
        httpOnly : true
    }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrat(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req , res ,next) => {
    res.locals.currentUser = req.user;
    res.locals.success  = req.flash('success');
    res.locals.error  = req.flash('error');
    // console.log(res.locals.success);
    next();
});

app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/review',reviewRoutes);
app.use('/',userRoutes);


/////////////////////////////////////////////

app.get('/', (req,res)=>{
    res.render('home');

})


app.get('*',(req,res,next) => {
    next(new expressError('Page not found',404))    
})

//////////////////////////////////////////////////

app.use((err,req,res,next) =>{
    const {statusCode = 500 } = err;
    if(!err.message){err.message = 'Oh no , oh no , oh no no no no'}
    res.status(statusCode).render('error',{err});
    // res.send('OHH BOIII')
})

const port = process.env.PORT || 3000
app.listen(port,() => {
    console.log(`Serving on ${port}`)
})
