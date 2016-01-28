var express = require("express");
var bodyParser = require("body-parser");
var _ = require("underscore");
var db = require("./db.js");

var app = express();
var port = process.env.PORT || 3000;
// var todos = [];
// var todoNextId = 1;

app.use(bodyParser.json());

app.get("/", function(req, res) {
    res.send("Todo API Root");
})

//  TODOS /////////////////////////////////////////////////////////////////////////

app.get("/todos", function(req, res) {
    var queryParams = req.query;
    // var filterdTodos = todos;
    var where = {};
    
    if(queryParams.hasOwnProperty("completed") && queryParams.completed === "true") {
        // filterdTodos = _.where(filterdTodos, {completed: true});
        where.completed = true;
    } else if(queryParams.hasOwnProperty("completed") && queryParams.completed === "false") {
        // filterdTodos = _.where(filterdTodos, {completed: false});
        where.completed = false;
    } 
    
    if(queryParams.hasOwnProperty("q") && typeof queryParams.q === "string" && queryParams.q.length > 0) {
        // filterdTodos = _.filter(filterdTodos, function(obj) {  
        //     return obj.description.toUpperCase().indexOf(queryParams.q.toUpperCase()) > -1;
        // });
        where.description = { $like: "%" + queryParams.q + "%" };
    }
    
    db.todo.findAll({where: where}).then(function(todos) {
            res.json(todos);
    }, function(error) {
        res.status(500).send();
    });
    
    // res.json(filterdTodos);
});

app.get("/todos/:id", function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    // var matchedTodo = _.findWhere(todos, {id: todoId});
    db.todo.findById(todoId).then(function(todo) {
        if(todo === null) {
            res.status(404).json({
                "error": "there is no todo in the database by this id"
            })
        } else {
            res.json(todo.toJSON());
        }
    }, function(error) {
        res.status(500).send();
    })
    // if(matchedTodo) {
    //     res.json(matchedTodo);
    // } else {
    //     res.status(404).send();
    // }
});

app.post("/todos", function(req, res) {
    var body = _.pick(req.body, "completed", "description");
    
    // if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
    //     return res.status(400).send();
    // }
    
    db.todo.create(body).then(function(todo) {
        res.json(todo.toJSON());
    }, function(error) {
        res.status(400).json(error);
    })
    
    // body.id = todoNextId;
    // todos.push(body);
    // res.json(body);
    // todoNextId++;
});

app.delete("/todos/:id", function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var where = { where: { id: todoId } };
    
    
    db.todo.destroy(where).then(function(todo) {
        if(todo) {
            res.json("Todo: " + todoId + " -> succesfully deleted from the list");
        } else {
            res.status(404).json({"error": "No todo with id"});
        }
    }, function(error) {
        res.status(500).send(error);
    })
    // var matchedTodo = _.findWhere(todos, {id: todoId});
    // 
    // if(!matchedTodo) {
    //     res.status(404).send({"error": "no todo found with that id"});
    // } else {
    //     todos = _.without(todos, matchedTodo);
    //     res.json(matchedTodo);
    // }
})

app.put("/todos/:id", function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var body = _.pick(req.body, "description", "completed");
    var attributes = {};
    
    // db.todo.findById(todoId).then(function(todo) {
    //     if(!todo) {
    //         return res.status(404).json({"error": "no todo found with that id"});
    //     }
    // });
    // 
    // 
    // if(body.hasOwnProperty("completed") && _.isBoolean(body.completed)) {
    //     validAttributes.completed = body.completed;
    // } else if(body.hasOwnProperty("completed")) {
    //     return res.status(400).send();
    // }
    // 
    // if(body.hasOwnProperty("description") && _.isString(body.description) && body.description.trim().length > 0) {
    //     validAttributes.description = body.description;
    // } else if(body.hasOwnProperty("description")) {
    //     return res.status(400).send();
    // }
    // 
    // db.todo.update(validAttributes, { where: todoId }).then(function(todos) {
    //     res.json({"success": "Todo is succesfully updated!"});
    // })
    
    if(body.hasOwnProperty("completed")) {
        attributes.completed = body.completed;
    }
    
    if(body.hasOwnProperty("description")) {
        attributes.description = body.description;
    }
    
    db.todo.findById(todoId).then(function(todo) {
        if(todo) {
            return todo.update(attributes);
        } else {
            res.status(404).send();
        }
    }, function() {
        res.status(500).send();
    }).then(function(todo) {
        res.json(todo.toJSON());
    }, function(error) {
        res.status(400).json(error);
    });
    
    // _.extend(matchedTodo, validAttributes);
    // res.json(validAttributes);
})

//  USERS /////////////////////////////////////////////////////////

app.post("/users", function(req, res) {
    var body = _.pick(req.body, "email", "password");
    console.log(body);
    
    db.user.create(body).then(function(user) {
        res.json(user.toJSON());
    }, function(error) {
        res.status(400).json(error);
    })
});

app.post("/users/login", function(req, res) {
    var body = _.pick(req.body, "email", "password");
    
    if(typeof body.email === "string" && typeof body.password === "string") {
        db.user.findOne({where: {
            email: body.email,
            password: body.password
        }}).then(function(user) {
            console.log(user);
            if(!!user) {
                res.json(user.toJSON()2);
            } else {
                res.status(401).send();
            }
        }, function(error) {
            res.status(500).send();
        })
        // res.json(body);
    } else {
        return res.status(400).send();
    }
    
});

db.sequelize.sync().then(function() {
    app.listen(port, function() {
        console.log("Express listening on port: " + port + "!");
    })
});

