//Imports
import express from "express";
import bodyParser from "body-parser";
import env from "dotenv";
import GoogleStrategy from "passport-google-oauth2";
import passport from "passport";
import session from "express-session";
import axios from "axios";

const app = express();
const port = 3000;

//Initialize the env module
env.config();
//console.log(process.env.API_KEY);

//Set up the express session config
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
    //console.log(req.user);
    res.render("signIn.ejs")
})

//Dashboard
app.get("/dashboard", (req, res) => {
    res.render("index.ejs");
})


//POSTING video link from front-end
app.post("/retrieveVideo", async (req, res) => {
    const videoURL = req.body.videoURL; //Get hold of the video link from the incoming request
    const parsedURL = new URL(videoURL); //Process the URL and extract query parameters to get the video ID
    const queryParams = new URLSearchParams(parsedURL.search);
    const videoId = queryParams.get('v');
    console.log(videoId);

    //Send Axios API request to the YouTube Data API
    try{
        const response = await axios.get("https://youtube.googleapis.com/youtube/v3/captions/AUieDabLVsuFGqu9UVE1NYAv0x2ugY0E-o5MkICzd9B3s_wT1Jc", {
            headers: {
                Authorization: `Bearer ${req.user}`,
            },
        });
        res.json({ data: response.data});
        } catch (error) {
            res.status(404).send(error.response.data);
        }
})


//When user signs in with Google
app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "https://www.googleapis.com/auth/youtube.force-ssl"]
    }
));


//Sign out
app.get("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    })
})


app.get(
    "/auth/google/retrieveVideo",
    passport.authenticate("google", {
        successRedirect: "/dashboard",
        failureRedirect: "/",
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
    return cb(null, acessToken);
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