const express = require('express');
const router = express.Router();

//import express validator
const { body, validationResult } = require('express-validator');

//import database
const connection = require('../config/database');

/**
 * INDEX group_wa
 */
router.get('/', function (req, res) {
    //query
    connection.query('SELECT * FROM group_wa ORDER BY id desc', function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'List Data group_was',
                data: rows
            })
        }
    });
});

/**
 * STORE group_wa
 */
 router.post('/store', [

    //validation
    body('judul').notEmpty(),
    body('deskripsi').notEmpty(),
    body('link').notEmpty(),

], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //define formData
    let formData = {
        judul: req.body.judul,
        deskripsi: req.body.deskripsi,
        link: req.body.link,

    }

    // insert query
    connection.query('INSERT INTO group_wa SET ?', formData, function (err, rows) {
        //if(err) throw err
        if (err) {  
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(201).json({
                status: true,
                message: 'Insert Data Successfully',
                data: rows[0]
            })
        }
    })

});

/**
 * SHOW group_wa
 */
router.get('/(:id)', function (req, res) {

    let id = req.params.id;

    connection.query(`SELECT * FROM group_wa WHERE id = ${id}`, function (err, rows) {

        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        }

        // if group_wa not found
        if (rows.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Data group_wa Not Found!',
            })
        }
        // if group_wa found
        else {
            return res.status(200).json({
                status: true,
                message: 'Detail Data group_wa',
                data: rows[0]
            })
        }
    })
})

/**
 * UPDATE group_wa
 */
router.patch('/update/:id', [

    //validation
    body('judul').notEmpty(),
    body('deskripsi').notEmpty(),
    body('link').notEmpty()

], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //id group_wa
    let id = req.params.id;

    //data group_wa
    let formData = {
        judul: req.body.judul,
        deskripsi: req.body.deskripsi,
        link: req.body.link,
    }

    // update query
    connection.query(`UPDATE group_wa SET ? WHERE id = ${id}`, formData, function (err, rows) {
        //if(err) throw err
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'Update Data Successfully!'
            })
        }
    })

});

/**
 * DELETE group_wa
 */
router.delete('/delete/(:id)', function(req, res) {

    let id = req.params.id;
     
    connection.query(`DELETE FROM group_wa WHERE id = ${id}`, function(err, rows) {
        //if(err) throw err
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'Delete Data Successfully!',
            })
        }
    })
});
module.exports = router;