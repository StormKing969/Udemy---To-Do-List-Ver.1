// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

// importing local module
const date = require(__dirname + "/date.js");

const app = express();

let items = ["Buy Food", "Cook Food", "Eat Food"];
let workItems = [];

// needed to use EJS
app.set("view engine", "ejs");

// need to use "body"
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))

app.get("/", function(req, res) {
    let day = date();

    // Passes the result to list.ejs
    res.render("list", {listTitle: day, newListItems: items});
});

app.post("/", function(req, res) {
    let item = req.body.newItem;

    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        // When post, save the value in variable then send to the "get"
        res.redirect("/");
    }

    
});

// ==============================================================================

app.get("/work", function(req, res) {
    res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.post("/work", function(req, res) {
    let item = req.body.newItem;

    workItems.push(item);
    
    // When post, save the value in variable then send to the "get"
    res.redirect("/work");
});


// ============================================================================

app.get("/about", function(req, res) {
    res.render("about");
});

app.listen(3000, function() {
    console.log("Server is connected to port 3000")
});