// Using .env file to store sensitive data
require("dotenv").config();

// Extracting the required information
const DB_URL = process.env.DB_URI;

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const port = process.env.PORT || 3000;

// importing local module
const date = require(__dirname + "/date.js");

const app = express();

// needed to use EJS
app.set("view engine", "ejs");

// need to use "body"
app.use(bodyParser.urlencoded({extended: true}));
// used to style the pages
app.use(express.static("public"))

// Create mongoose DB
mongoose.connect(DB_URL);

// ===================================================================

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to the TODO APP"
});

const item2 = new Item({
    name: "Hit the + button to add a new item"
});

const item3 = new Item({
    name: "<<< Check this box to delete"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/:customListName", function(req, res) {
    const customLink = _.capitalize(req.params.customListName);

    List.findOne({name: customLink}, function(err, foundOne) {
        if(!err) {
            if(!foundOne) {
                console.log("Link doesn't exist");
                // Create a new list
                newList(customLink);

                res.redirect("/" + customLink);
            } else {
                // Show existing list
                console.log("Link exist")
                res.render("list", {listTitle: foundOne.name, newListItems: foundOne.items});
            }
        } else {
            console.log(err);
        }
    })
})

let day = date();

app.get("/", function(req, res) {
    // Looks through the array
    Item.find({}, function(err, foundItems) {
        // console.log(foundItems);
        if(err) {
            console.log(err);
        } else if(foundItems.length === 0) {
            createList();
            res.redirect("/");
        } else {
            // Passes the result to list.ejs
            res.render("list", {listTitle: "day", newListItems: foundItems});
        }
    })

});

app.post("/", function(req, res) {
    const item = req.body.newItem;
    const listName = req.body.list;

    // if (req.body.list === "Work") {
    //     workItems.push(item);
    //     res.redirect("/work");
    // } else {
    // }
    
    if(listName == "day") {
        updateItemList(item).save();
    
        // When post, save the value in variable then send to the "get"
        res.redirect("/");
    } else {
        List.findOne({name: listName}, function(err, foundList) {
            if(!err) {
                // Alternate fix
                // const newitem = new Item({
                //     name: item
                // });
                // console.log(foundList.items)

                foundList.items.push(updateItemList(item));
                foundList.save();
                res.redirect("/" + listName);
            } else {
                console.log(err);
            }
        })
    }
});

app.post("/delete", function(req, res) {
    const checkedItemID = req.body.box;
    const listName = req.body.listName;

    if(listName == "day") {
        deleteItems(checkedItemID);
    
        // When post, save the value in variable then send to the "get"
        res.redirect("/");
    } else {
        List.findOneAndUpdate(
            {name: listName}, 
            {$pull: {items: {_id: checkedItemID}}},
            function(err, foundList) {
                if(!err) {
                    console.log("Removal was successful");
                    res.redirect("/" + listName);
                } else {
                    console.log(err);
                }
        })
    }
})

app.listen(port, function() {
    console.log("Server is connected to port " + port);
});

// ========================================================================

function deleteItems(item_id) {
    Item.findByIdAndRemove(item_id, function(err) {
        if(!err) {
            console.log("Removal was successful");
        } else {
            console.log(err);
        }
    })
}

function createList() {
    Item.insertMany(defaultItems, function(error, docs) {
        if(error) {
            console.log(error);
        } else {
            console.log("Creation of default list successful");
        }
    });
}

function updateItemList(userInput) {
    const item = new Item({
        name: userInput
    });

    return item;

    // Remove the save function to enable save in different lists
    // item.save();
}

function newList(newLink) {
    const list = new List({
        name: newLink,
        items: defaultItems
    });

    list.save();
}