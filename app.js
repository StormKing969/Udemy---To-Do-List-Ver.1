const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const port = 3000;

// importing local module
const date = require(__dirname + "/date.js");

const app = express();

// needed to use EJS
app.set("view engine", "ejs");

// need to use "body"
app.use(bodyParser.urlencoded({extended: true}));
// used to style the pages
app.use(express.static("public"))

let workItems = [];

// Create mongoose DB
mongoose.connect("mongodb://localhost:27017/ToDoList");

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Wake"
});

const item2 = new Item({
    name: "Brush your teeth"
});

const item3 = new Item({
    name: "Clean your bed"
});

const defaultItems = [item1, item2, item3];

Item.insertMany(defaultItems, function(error, docs) {
    if(error) {
        console.log(error);
    } else {
        console.log("Successful")
    }
});

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

app.listen(port, function() {
    console.log("Server is connected to port " + port)
});