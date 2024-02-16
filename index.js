//Imports
import express from "express";

const app = express();
const port = 3000;

//Middleware
app.use(express.static("public")); //Set up the public static files folder

//Root end point
app.get("/", (req, res) => {
    res.render("index.ejs")
})

//Start the server on port variable
app.listen(`${port}`, () => {
    console.log("Server running on port 3000.");
});
