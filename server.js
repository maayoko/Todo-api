var express = require("express");
var app = express();
var port = process.env.PORT || 3000;
var todos = [{
    id: 1,
    description: "Meet mom for lunch",
    completed: false
}, {
    id: 2,
    description: "Go to market",
    completed: false
}, {
    id: 3,
    description: "Feed the cat",
    completed: true
}];

app.get("/", function(req, res) {
    res.send("Todo API Root");
})

app.get("/todos", function(req, res) {
    res.json(todos);
});

app.get("/todos/:id", function(req, res) {
    var todoId = req.params.id;
    var cntr = 0;
    todos.forEach(function(element) {
        if(element.id.toString() === todoId) {
            res.json(element);
            cntr++;
        }; 
    })
    
    if(cntr === 0) {
        // res.send("404 Error. Todo with " + todoId + " is not found.");
        res.status(404).send();
    }
    // res.send("Asking for todo with id of " + req.params.id);
});

app.listen(port, function() {
    console.log("Express listening on port: " + port + "!");
})