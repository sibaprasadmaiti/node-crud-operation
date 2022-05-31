const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/usersDb", { useNewUrlParser:true }, (err) => {
    if (!err) {
        console.log(`connection successful`);
    } else {
        console.log('connection faild'+ err);
    }
});

require('./user.model');