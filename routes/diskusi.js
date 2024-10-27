const express = require('express');
const router = express.Router();

//import express validator
const { body, validationResult } = require('express-validator');

//import database
const connection = require('../config/database');

/**
 * INDEX diskusi
 */
router.get('/', function (req, res) {
    //query
    connection.query('SELECT A.id, A.judul, A.pertanyaan, A.tgl_dibuat, B.nama FROM diskusi A LEFT JOIN user B ON A.fk_user=B.id ORDER BY A.id desc', function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'List Data diskusis',
                data: rows
            })
        }
    });
});

/**
 * STORE diskusi
 */
 router.post('/store', [

    //validation
    body('fk_user').notEmpty(),
    body('judul').notEmpty(),
    body('pertanyaan').notEmpty(),

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
        judul: req.body.judul,
        pertanyaan: req.body.pertanyaan,
    }

    // insert query
    connection.query('INSERT INTO diskusi SET ?', formData, function (err, rows) {
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
 * SHOW diskusi
 */
router.get('/(:id)', function (req, res) {

    let id = req.params.id;

    connection.query(`SELECT * FROM diskusi WHERE id = ${id}`, function (err, rows) {

        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        }

        // if diskusi not found
        if (rows.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Data diskusi Not Found!',
            })
        }
        // if diskusi found
        else {
            return res.status(200).json({
                status: true,
                message: 'Detail Data diskusi',
                data: rows[0]
            })
        }
    })
})

/**
 * UPDATE diskusi
 */
router.patch('/update/:id', [

    //validation
    body('fk_user').notEmpty(),
    body('judul').notEmpty(),
    body('pertanyaan').notEmpty(),

], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //id diskusi
    let id = req.params.id;

    //data diskusi
    let formData = {
        fk_user: req.body.fk_user,
        judul: req.body.judul,
        pertanyaan: req.body.pertanyaan,
    }

    // update query
    connection.query(`UPDATE diskusi SET ? WHERE id = ${id}`, formData, function (err, rows) {
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
 * DELETE diskusi
 */
router.delete('/delete/(:id)', function(req, res) {

    let id = req.params.id;
     
    connection.query(`DELETE FROM diskusi WHERE id = ${id}`, function(err, rows) {
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