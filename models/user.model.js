const mongoose = require("mongoose");
var usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: "This field is required."
    },
    email: {
        type: String,
        required: "This field is required.",
        validate: {
            validator: function (v) {
                emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return emailRegex.test(v);
            },
            message: 'Invalid e-mail.'
        }
    },
    mobile: {
        type: String,
        required: "This field is required.",
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v);
            },
            message: '{VALUE} is not a valid 10 digit number!'
        }
    },
    city: {
        type: String
    },
    image: {
        type: String
    }

})

// //Custom validation for email
// usersSchema.path('email').validate((val) => {
//     emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return emailRegex.test(val);
// }, 'Invalid e-mail.');

// now we need to crete a collections
mongoose.model("User", usersSchema);
