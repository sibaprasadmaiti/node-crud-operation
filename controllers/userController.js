const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const multer = require('multer');

//router.use(express.static(__dirname +'./uploads/'));

router.get('/addOrEdit', (req, res) => {
    res.render('user/addOrEdit', {
        viewTitle: "Insert user"
    });
});

router.get('/', (req, res) => {
    User.find((err, docs) => {
        if (!err) {
            res.render("user/list", {
                list: docs
            });
        } else {
            console.log('Error in retrieing list :' + err);
        }
    }).lean();
});

router.get('/:id', (req, res) => {
    User.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render('user/addOrEdit', {
                viewTitle: "Update User",
                user: doc
            });
        } else {
            console.log('Update time error : ' + err);
        }
    }).lean();
});

router.get('/delete/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/user');
        } else {
            console.log('Error in user delete : ' + err);
        }
    });
});

router.get('/details/:id', (req, res) => {
    User.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render('user/details', {
                list: doc
            });
        } else {
            console.log('Details view error : ' + err);
        }
    }).lean();
});

//set storage
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        //image.jpg
        var extention = file.originalname.substr(file.originalname.lastIndexOf('.'));

        cb(null, file.fieldname + '-' + Date.now() + extention);
        //cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    // limits: {
    //     fileSize: 1024 * 1024 * 2
    // },
    fileFilter: fileFilter
});

router.post('/', upload.single('image'), (req, res) => {
    if (req.body._id == '') {
        insertRecords(req, res);
    } else {
        updateRecords(req, res);
    }
});

function insertRecords(req, res) {
    console.log(req);
    var user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.mobile = req.body.mobile;
    user.city = req.body.city;
    if(req.file)
    user.image = req.file.filename;
    user.save((err, doc) => {
        if (!err) {
            res.redirect('user/');
        } else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render('user/addOrEdit', {
                    viewTitle: "Insert User",
                    user: req.body
                });
            } else {
                console.log('Error during record insertion : ' + err);
            }
        }
    });
}

function updateRecords(req, res) {
    if (typeof req.file !== "undefined") {
        var imageData = { $set: { name: req.body.name, email: req.body.email, mobile: req.body.mobile, city: req.body.city, image: req.file.filename } };
    } else {
        var imageData = { $set: { name: req.body.name, email: req.body.email, mobile: req.body.mobile, city: req.body.city } };
    }

    User.findOneAndUpdate({ _id: req.body._id }, imageData, { new: true }, (err, doc) => {
        if (!err) {
            res.redirect('user/');
        } else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render('user/addOrEdit', {
                    viewTitle: "Update User",
                    user: req.body
                });
            } else {
                console.log('Error during record update : ' + err);
            }
        }
    });
}


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'name':
                body['nameError'] = err.errors[field].message;
                break;

            case 'email':
                body['emailError'] = err.errors[field].message;
                break;

            case 'mobile':
                body['mobileError'] = err.errors[field].message;
                break;

            default:
                break;
        }
    }
}

module.exports = router;