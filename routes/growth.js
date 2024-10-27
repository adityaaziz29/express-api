const express = require('express');
const router = express.Router();

//import express validator
const { body, validationResult } = require('express-validator');

//import database
const connection = require('../config/database');

/**
 * INDEX Perkembangan
 */
router.get('/', function (req, res) {
    //query
    connection.query('SELECT * FROM perkembangan ORDER BY id desc', function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'List Data Perkembangan',
                data: rows
            })
        }
    });
});

/**
 * STORE perkembangan
 */
 router.post('/store', [

    //validation
    body('fk_anak').notEmpty(),
    body('bulan').notEmpty(),
    body('bb').notEmpty(),
    body('tb').notEmpty(),
    body('lingkar').notEmpty()

], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //define formData
    let formData = {
        fk_anak: req.body.fk_anak,
        bulan: req.body.bulan,
        bb: req.body.bb,
        tb: req.body.tb,
        lingkar: req.body.lingkar,
    }

    // insert query
    connection.query('INSERT INTO perkembangan SET ?', formData, function (err, rows) {
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
 * SHOW perkembangan
 */
router.get('/(:id)', function (req, res) {

    let id = req.params.id;

    // Modifikasi query untuk memformat bulan dan tahun saja
    connection.query(`SELECT id, fk_anak, DATE_FORMAT(bulan, '%Y-%m-%d') AS bulan, bb, tb, lingkar, tgl_dibuat, status_hapus FROM perkembangan WHERE fk_anak = ${id}`, function (err, rows) {

        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            });
        }

        // if perkembangan not found
        if (rows.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Data perkembangan Not Found!',
            });
        }
        // if perkembangan found
        else {
            return res.status(200).json({
                status: true,
                message: 'Detail Data perkembangan',
                data: rows
            });
        }
    });
});


/**
 * UPDATE perkembangan
 */
router.patch('/update/:id', [

    //validation
    body('fk_anak').notEmpty(),
    body('bulan').notEmpty(),
    body('bb').notEmpty(),
    body('tb').notEmpty(),
    body('lingkar').notEmpty()

], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //id perkembangan
    let id = req.params.id;

    //data perkembangan
    let formData = {
        fk_anak: req.body.fk_anak,
        bulan: req.body.bulan,
        bb: req.body.bb,
        tb: req.body.tb,
        lingkar: req.body.lingkar,
    }

    // update query
    connection.query(`UPDATE perkembangan SET ? WHERE id = ${id}`, formData, function (err, rows) {
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
 * DELETE perkembangan
 */
router.delete('/delete/(:id)', function(req, res) {

    let id = req.params.id;
     
    connection.query(`DELETE FROM perkembangan WHERE id = ${id}`, function(err, rows) {
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