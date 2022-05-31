const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const userRouter = require('./routes/users');


const url = 'mongodb://127.0.0.1:27017/usersDb';
const app = express();

mongoose.connect(url, {useNewUrlParser:true}, (err)  => {
    if (!err) {
        console.log("Database connection successfully!");
    } else {
        console.log("Database connection error "+ err);
    }
});

//app.use(express.json());

app.use(bodyparser.urlencoded({
    extended : true
}));
app.use(bodyparser.json());


//set view engin
app.set('views','./views');
app.set('view engine', 'hbs');

app.use('/', userRouter);


app.listen(3050, () => {
    console.log("Server is running...");
})
