var express = require("express");
var bodyParser = require("body-parser");
var _ = require("underscore");

var app = express();
var port = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get("/", function(req, res) {
    res.send("Todo API Root");
})

app.get("/todos", function(req, res) {
    res.json(todos);
});

app.get("/todos/:id", function(req, res) {
    var todoId = parseInt(req.params.id);
    var matchedTodo = _.findWhere(todos, {id: todoId});
    if(matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
});

app.post("/todos", function(req, res) {
    var body = _.pick(req.body, "completed", "description");
    
    if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
        return res.status(400).send();
    }
    
    body.description = body.description.trim(); 
    
    body.id = todoNextId;
    todos.push(body);
    res.json(body);
    todoNextId++;
});

app.delete("/todos/:id", function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});
    
    if(!matchedTodo) {
        res.status(404).send({"error": "no todo found with that id"});
    } else {
        todos = _.without(todos, matchedTodo);
        res.json(matchedTodo);
    }
})

app.put("/todos/:id", function(req, res) {
    var todoId = parseInt(req.params.id);
    var matchedTodo = _.findWhere(todos, {id: todoId});
    var body = _.pick(req.body, "description", "completed");
    var validAttributes = {};
    
    if(!matchedTodo) {
        return res.status(404).send({"error": "no todo found with that id"});
    }
    
    if(body.hasOwnProperty("completed") && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if(body.hasOwnProperty("completed")) {
        return res.status(400).send();
    }
    
    if(body.hasOwnProperty("description") && _.isString(body.description) && body.description.trim().length > 0) {
        validAttributes.description = body.description;
    } else if(body.hasOwnProperty("description")) {
        return res.status(400).send();
    }
    
    _.extend(matchedTodo, validAttributes);
    res.json(validAttributes);
})

app.listen(port, function() {
    console.log("Express listening on port: " + port + "!");
})