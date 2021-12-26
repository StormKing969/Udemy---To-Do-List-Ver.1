// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.get("/", function(req, res) {
    var today = new Date();

    if(today.getDay() === 6 || today.getDay() === 0) {
        res.send("It's a weedend :)")
    } else {
        res.send("I have work to do :(")
    }
});

app.listen(3000, function() {
    console.log("Server is connected to port 3000")
});