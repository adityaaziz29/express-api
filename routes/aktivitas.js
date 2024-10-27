const express = require('express');
const router = express.Router();

//import express validator
const { body, validationResult } = require('express-validator');

//import database
const connection = require('../config/database');

/**
 * INDEX aktivitas
 */
router.get('/', function (req, res) {
    //query
    connection.query('SELECT * FROM aktivitas ORDER BY id desc', function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'List Data aktivitass',
                data: rows
            })
        }
    });
});

/**
 * STORE aktivitas
 */
 router.post('/store', [

    //validation
    body('fk_user').notEmpty(),
    body('kegiatan').notEmpty(),
    body('jam').notEmpty(),

], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //define formData
    let formData = {
        fk_user: req.body.fk_user,
        kegiatan: req.body.kegiatan,
        jam: req.body.jam,
    }

    // insert query
    connection.query('INSERT INTO aktivitas SET ?', formData, function (err, rows) {
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
 * SHOW aktivitas
 */
router.get('/(:id)', function (req, res) {

    let id = req.params.id;

    connection.query(`SELECT * FROM aktivitas WHERE fk_user = ${id} ORDER BY id desc`, function (err, rows) {

        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        }

        // if aktivitas not found
        if (rows.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Data aktivitas Not Found!',
            })
        }
        // if aktivitas found
        else {
            return res.status(200).json({
                status: true,
                message: 'Detail Data aktivitas',
                data: rows
            })
        }
    })
})

/**
 * UPDATE aktivitas
 */
router.patch('/update/:id', [

    //validation
    body('fk_user').notEmpty(),
    body('kegiatan').notEmpty(),
    body('jam').notEmpty(),

], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //id aktivitas
    let id = req.params.id;

    //data aktivitas
    let formData = {
        fk_user: req.body.fk_user,
        kegiatan: req.body.kegiatan,
        jam: req.body.jam,
    }

    // update query
    connection.query(`UPDATE aktivitas SET ? WHERE id = ${id}`, formData, function (err, rows) {
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
 * DELETE aktivitas
 */
router.delete('/delete/(:id)', function(req, res) {

    let id = req.params.id;
     
    connection.query(`DELETE FROM aktivitas WHERE id = ${id}`, function(err, rows) {
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