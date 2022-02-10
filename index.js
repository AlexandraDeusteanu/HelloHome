if(process.env.NODE_ENV !== "production") {
    require("dotenv").config()
    
}


const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utilities/ExpressError")
const mongoose = require("mongoose");


const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local")
const User = require("./models/user")
const helmet = require("helmet");

const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");
const usersRoutes = require("./routes/users")
const mongoSanitize = require('express-mongo-sanitize');

mongoose.connect('mongodb://localhost:27017/hello-home'), {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}

const db = mongoose.connection;
//db connection status->
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

app.engine("ejs", ejsMate)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());
app.use(helmet());


 
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/diamqhs7d/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/diamqhs7d/"
];
const connectSrcUrls = [
    "https://*.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://events.mapbox.com",
    "https://res.cloudinary.com/diamqhs7d/"
];
const fontSrcUrls = [ "https://res.cloudinary.com/diamqhs7d/" ];
 
app.use(
    helmet.contentSecurityPolicy({
        directives : {
            defaultSrc : [],
            connectSrc : [ "'self'", ...connectSrcUrls ],
            scriptSrc  : [ "'unsafe-inline'", "'self'", ...scriptSrcUrls ],
            styleSrc   : [ "'self'", "'unsafe-inline'", ...styleSrcUrls ],
            workerSrc  : [ "'self'", "blob:" ],
            objectSrc  : [],
            imgSrc     : [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/diamqhs7d/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                "https://images.unsplash.com/"
            ],
            fontSrc    : [ "'self'", ...fontSrcUrls ],
            mediaSrc   : [ "https://res.cloudinary.com/diamqhs7d/" ],
            childSrc   : [ "blob:" ]
        }
    },
    )
);


const sessionConfig = {
    name: "session",
    secret: "thisshouldbeabettersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");  //ai access la success oriunde
    next(); 
})


app.use("/", usersRoutes)
app.use("/campgrounds", campgroundsRoutes)
app.use("/campgrounds/:id/reviews", reviewsRoutes)

app.get("/", (req, res) => {
    res.render("home")
});


app.all("*", (req, res, next) => {
    next(new ExpressError("Page not found", 404))
});
//error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
});
app.listen(3000, () => {
    console.log("serving on 3000")
});