//Imports
import express from "express";
import bodyParser from "body-parser";
import env from "dotenv";

const app = express();
const port = 3000;

//Initialize the env module
env.config();

//Middleware
app.use(express.static("public")); //Set up the public static files folder
app.use(bodyParser.urlencoded({ extended: true }));

//Root endpoint
app.get("/", (req, res) => {
    res.render("index.ejs")
    console.log(process.env.API_KEY);
})


//POSTING video link from front-end
app.post("/retrieveVideo", (req, res) => {
    const videoURL = req.body.videoURL; //Get hold of the video link from the request
    console.log(videoURL);
})


//Start the server on port variable
app.listen(`${port}`, () => {
    console.log("Server running on port 3000.");
});
