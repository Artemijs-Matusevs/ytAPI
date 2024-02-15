//Imports
import express from "express";

const app = express();
const port = 3000;

//Root end point
app.get("/", (req, res) => {
    res.render("index.ejs")
})

//Start the server on port variable
app.listen(`${port}`, () => {
    console.log("Server running on port 3000.");
});
