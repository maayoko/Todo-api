var Sequelize = require("sequelize");
var sequelize = new Sequelize(undefined, undefined, undefined, {
    dialect: "sqlite",
    storage: __dirname + "/sqlite.sqlite"
});

var Todo = sequelize.define("todo", {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1, 250]
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

sequelize.sync().then(function() {
    console.log("Everything is synced!");
    
    Todo.findById(3).then(function(todo) {
        if(todo) {
            console.log(todo.toJSON());
        } else {
            console.log("No match found")
        }
        
    })
    
    // Todo.create({
    //     description: "Walk my dog",
    //     completed: false
    // }).then(function(todo) {
    //     return Todo.create({
    //         description: "Clean office"
    //     });
    // }).then(function() {
    //     // return Todo.findById(1);
    //     return Todo.findAll({
    //         where: {
    //             description: {
    //                 $like: "%dog%"
    //             }
    //         }
    //     });
    // }).then(function(todo) {
    //     if(todo) {
    //         todo.forEach(function(todo) {
    //             console.log(todo.toJSON());
    //         })
    //     } else {
    //         console.log("no todo found");
    //     }
    // }).catch(function(error) {
    //     console.log(error);
    // });
})