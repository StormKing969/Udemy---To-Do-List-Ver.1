// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");

// res.send("") => sends one text


// res.write("") => used to send multiple texts 
// res.write("")
// res.send()

// res.sendFile => sends an entire html file

app.get("/", function(req, res) {
    var today = new Date();
    var currentDay = today.getDay();
    var day = "";

    // if(currentDay === 0) {
    //     day = "Sunday";
    //     // write a text
    //     // res.write("<h1>It's a weedend :)</h1>")
    // } else if (currentDay === 1) {
    //     day = "Monday";
    // } else if (currentDay === 2) {
    //     day = "Tuesday";
    // } else if (currentDay === 3) {
    //     day = "Wednesday";
    // } else if (currentDay === 4) {
    //     day = "Thursday";
    // } else if (currentDay === 5) {
    //     day = "Friday";
    // } else {
    //     day = "Saturday";
    //     // send a file
    //     // res.sendFile(__dirname + "/index.html")
    // }

    switch (currentDay) {
        case 0:
            day = "Sunday";
            break;
        case 1:
            day = "Monday";
            break;
        case 2:
            day = "Tuesday";
            break;     
        case 3:
            day = "Wednesday";
            break;
        case 4:
            day = "Thursday";
            break;
        case 5:
            day = "Friday";
            break;
        case 6:
            day = "Saturday";
            break;            
        default:
            console.log("Error: Current Day value is: " + currentDay); 
            break;
    }

    // Passes the result to list.ejs
    res.render("list", {kindOfDay: day});
});

app.listen(3000, function() {
    console.log("Server is connected to port 3000")
});