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

// Create mongoose DB
mongoose.connect("mongodb://localhost:27017/ToDoList");

// ===================================================================

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

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/:customListName", function(req, res) {
    const customLink = req.params.customListName;

    List.findOne({name: customLink}, function(err, foundOne) {
        if(!err) {
            if(!foundOne) {
                console.log("Doesn't exist");
                // Create a new list
                newList(customLink);

                res.redirect("/" + customLink);
            } else {
                // Show existing list
                console.log("Exist")
                res.render("list", {listTitle: foundOne.name, newListItems: foundOne.items});
            }
        } else {
            console.log(err);
        }
    })
})

app.get("/", function(req, res) {
    let day = date();

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
            res.render("list", {listTitle: day, newListItems: foundItems});
        }
    })

});

app.post("/", function(req, res) {
    let item = req.body.newItem;

    // if (req.body.list === "Work") {
    //     workItems.push(item);
    //     res.redirect("/work");
    // } else {
    // }
    
    updateItemList(item);
    // When post, save the value in variable then send to the "get"
    res.redirect("/");
});

app.post("/delete", function(req, res) {
    const checkedItem = req.body.box;

    deleteItems(checkedItem);
    res.redirect("/");
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
            console.log("Successful");
        }
    });
}

function updateItemList(userInput) {
    const item = new Item({
        name: userInput
    });

    item.save();
}

function newList(newLink) {
    const list = new List({
        name: newLink,
        items: defaultItems
    });

    list.save();
}