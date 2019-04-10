//dependencies required for the app
const fs = require('fs');
var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
//render css files
app.use(express.static("public"));

//placeholders for added task
var task = [];
//placeholders for removed task
var complete = [];
//user authentication
var authentication = false;
//placeholders for accounts
var account = [];
//placeholder for messags
var msg = "";

//Post methods

app.post("/addtask", function(req, res) {
    var newTask = req.body.newtask;
    //add the new task from the post route

    if (newTask !== "") {
        task.push(newTask);
    }

    res.redirect("/");
});

app.post("/removetask", function(req, res) {
    var completeTask = req.body.check;
    //check for the "typeof" the different completed task, then add into the complete task
    if (typeof completeTask === "string") {
        complete.push(completeTask);
        //check if the completed task already exits in the task when checked, then remove it
        task.splice(task.indexOf(completeTask), 1);
    } else if (typeof completeTask === "object") {
        for (var i = 0; i < completeTask.length; i++) {
            complete.push(completeTask[i]);
            task.splice(task.indexOf(completeTask[i]), 1);
        }
    }
    res.redirect("/");
});

app.post("/cleartask", function(req, res) {

    task = [];
    complete =[];

    res.redirect("/");
});

app.post("/register", function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;

    if(password !== repassword) {
        msg = "Passwords are not the same."
    } else{
        var user_exists = false;
        for (var i = 0; i < account.length; i++) {
            if (account[i].username === username) {
                msg = "Username already exist.";
                user_exists = true;
                break;
            }
        }
        if (user_exists === false){
            var User = {
                username: username,
                password: password,
                task: task,
                complete: complete
            };

            account.push(User);

            try {
                var readUser = fs.readFileSync('users.json');
                var users = JSON.parse(readUser);

                users.push(User);

                fs.writeFileSync('users.json', JSON.stringify(users, undefined, 2));

            } catch(err){

                var resultString = JSON.stringify(account, undefined, 2);

                fs.writeFile(`users.json`, resultString, 'utf8', function (err) {
                        if (err) {
                            console.log("An error occurred while writing JSON Object to File.");
                            return console.log(err);
                        }
                        console.log("JSON file has been saved.");
                    }

                );
            }

            msg = "Account set up complete"
        }
        res.redirect("/signup");
    }
});

app.post("/verify", function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    for (var i = 0; i < account.length; i++) {
        if (account[i].username === username && account[i].password === password) {
            authentication = true;
        }
    }

    res.redirect("/");
});

app.post("/redirectsignup", function(req, res) {
    msg = "";
    res.redirect("/signup");
});

app.post("/redirectlogin", function(req, res) {
    res.redirect("/login");
});


//render ejs
app.get("/", function(req, res) {
    if (authentication === false){
        res.redirect("/login");
    } else {
        res.render("index", {task: task, complete: complete});
    }
});

app.get("/login", function(req, res) {

    try {
        var readUser = fs.readFileSync('users.json');
        var users = JSON.parse(readUser);
        var count = 0;

        for (var u = 0; u < users.length; u++) {
            for (var i = 0; i < account.length; i++) {
                if(users[u].username === account[i].username){
                    count += 1
                }
            }
            if (count === 0){
                account.push(users[u]);
            } else{
                count = 0;
            }
        }

    } catch(err){

        var resultString = JSON.stringify(account, undefined, 2);

        fs.writeFile(`users.json`, resultString, 'utf8', function (err) {
                if (err) {
                    console.log("An error occurred while writing JSON Object to File.");
                    return console.log(err);
                }
            }

        );
    }

    res.render("login");
});

app.get("/signup", function(req, res) {
    res.render("signup", {msg: msg});
});

//set app to listen on port 3000
app.listen(3000, function() {
    console.log("server is running on port 3000");
});
