//Imports
import express from "express";
import bodyParser from "body-parser";
import env from "dotenv";
import GoogleStrategy from "passport-google-oauth2";
import passport from "passport";
import session from "express-session";

const app = express();
const port = 3000;

//Initialize the env module
env.config();
//console.log(process.env.API_KEY);

//Set up the express session
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
)

app.use(passport.initialize());
app.use(passport.session());

//Middleware
app.use(express.static("public")); //Set up the public static files folder
app.use(bodyParser.urlencoded({ extended: true }));

//Root endpoint
app.get("/", (req, res) => {
    console.log(req.user);
    res.render("index.ejs")
})


//POSTING video link from front-end
app.post("/retrieveVideo", (req, res) => {
    const videoURL = req.body.videoURL; //Get hold of the video link from the incoming request
    console.log(videoURL);
})


//When user signs in with Google
app.get("/auth/google", passport.authenticate("google", {scope: ["profile"]}));


app.get(
    "/auth/google/retrieveVideo",
    passport.authenticate("google", {
        successRedirect: "/",
        failureRedirect: "/nothing",
    })
)


//Configure google strategy module
passport.use("google", new GoogleStrategy(
{
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/retrieveVideo",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
(acessToken, refreshToken, profile, cb) =>{
    cb(null, profile);
}))


//Serialize and deserialize user
passport.serializeUser((user, cb) => {
    cb(null, user);
})
passport.deserializeUser((user, cb) => {
    cb(null, user);
})




//Start the server on port variable
app.listen(`${port}`, () => {
    console.log("Server running on port 3000.");
});