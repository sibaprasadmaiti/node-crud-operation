const express = require('express');
const excel = require('exceljs');
const router = express.Router();
const User = require('../models/user');


//get all users
router.get('/', async (req, res) => {
    try {
        const userResult = await User.find().lean();
        //res.json(user);
        res.render('index', {
            viewTitle: "Users List",
            user: userResult
        });
    } catch (error) {
        res.send('Error: ' + error);
    }
});

//load add form
router.get('/add', async (req, res) => {
    res.render('add', {
        viewTitle: "Add New User"
    });
});

//insert new user
router.post('/', async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile
    })

    try {
        const us = await user.save();
        // res.json(us);
        res.redirect('/');
    } catch (error) {
        res.send('Err: ' + error);
    }
});

//get user by id
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.render('edit', {
            viewTitle: "Update User",
            user: user
        });
    } catch (error) {
        res.send('Err: ' + error);
    }
});

//update user
router.post('/edit', async (req, res) => {
    try {
        const us = await User.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true });
        res.redirect('/');
    } catch (error) {
        console.log('Err: ' + error);
    }
});

//delete user
router.get('/delete/:id', async (req, res) => {
    try {
        await User.findByIdAndRemove(req.params.id);
        res.redirect('/');
    } catch (error) {
        res.send('Err : ' + error);
    }
});

//download excel file
router.get('/users/excel-download', async (req, res) => {

    try {
        const jsonUsers = await User.find();
        // const jsonUsers = JSON.parse(JSON.stringify(userResult));

        let workbook = new excel.Workbook(); //creating workbook
        let worksheet = workbook.addWorksheet('Users'); //creating worksheet

        //  WorkSheet Header
        worksheet.columns = [
            { header: 'Id', key: 'id', width: 10 },
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Mobile', key: 'mobile', width: 10, outlineLevel: 1 }
        ];

        // Add Array Rows
        worksheet.addRows(jsonUsers);

        // Write to File
        // workbook.xlsx.writeFile("customer.xlsx")
        // .then(function() {
        // 	console.log("file saved!");
        // });
        let timestamp = new Date().getTime().toString();
        // res is a Stream object
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "user-" + timestamp + ".xlsx"
        );

        // Write to File
        return workbook.xlsx.write(res)
            .then(function () {
                console.log("file saved!");
                res.status(200).end();
            });

    } catch (error) {
        res.send('Error: ' + error);
    }
});

module.exports = router;