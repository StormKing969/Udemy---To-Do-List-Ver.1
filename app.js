// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// res.send("") => sends one text


// res.write("") => used to send multiple texts 
// res.write("")
// res.send()

// res.sendFile => sends an entire html file

app.get("/", function(req, res) {
    var today = new Date();

    if(today.getDay() === 6 || today.getDay() === 0) {
        res.write("<h1>It's a weedend :)</h1>")
    } else {
        res.sendFile(__dirname + "/index.html")
    }
});

app.listen(3000, function() {
    console.log("Server is connected to port 3000")
});