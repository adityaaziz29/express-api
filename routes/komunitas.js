const express = require('express');
const router = express.Router();

//import express validator
const { body, validationResult } = require('express-validator');

//import database
const connection = require('../config/database');

/**
 * INDEX komunitas
 */
router.get('/', function (req, res) {
    //query
    connection.query('SELECT * FROM komunitas ORDER BY id desc', function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'List Data komunitas',
                data: rows
            })
        }
    });
});

/**
 * STORE komunitas
 */
 router.post('/store', [

    //validation
    body('nama').notEmpty(),
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
        nama: req.body.nama,
        link: req.body.link,
    }

    // insert query
    connection.query('INSERT INTO komunitas SET ?', formData, function (err, rows) {
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
 * SHOW komunitas
 */
router.get('/(:id)', function (req, res) {

    let id = req.params.id;

    connection.query(`SELECT * FROM komunitas WHERE id = ${id}`, function (err, rows) {

        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        }

        // if komunitas not found
        if (rows.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Data komunitas Not Found!',
            })
        }
        // if komunitas found
        else {
            return res.status(200).json({
                status: true,
                message: 'Detail Data komunitas',
                data: rows[0]
            })
        }
    })
})

/**
 * UPDATE komunitas
 */
router.patch('/update/:id', [

    //validation
    body('nama').notEmpty(),
    body('link').notEmpty(),

], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //id komunitas
    let id = req.params.id;

    //data komunitas
    let formData = {
        nama: req.body.nama,
        link: req.body.link,
    }

    // update query
    connection.query(`UPDATE komunitas SET ? WHERE id = ${id}`, formData, function (err, rows) {
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
 * DELETE komunitas
 */
router.delete('/delete/(:id)', function(req, res) {

    let id = req.params.id;
     
    connection.query(`DELETE FROM komunitas WHERE id = ${id}`, function(err, rows) {
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