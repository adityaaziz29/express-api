const express = require('express');
const router = express.Router();

//import express validator
const { body, validationResult } = require('express-validator');

//import database
const connection = require('../config/database');

/**
 * INDEX pencapaian
 */
router.get('/', function (req, res) {
    //query
    connection.query('SELECT * FROM pencapaian ORDER BY id desc', function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'List Data pencapaian',
                data: rows
            })
        }
    });
});

/**
 * STORE pencapaian
 */
 router.post('/store', [

    //validation
    body('fk_anak').notEmpty(),
    body('bulan').notEmpty(),
    body('jalan').notEmpty(),
    body('lompat').notEmpty(),
    body('lempar').notEmpty(),
    body('gunting').notEmpty(),
    body('gambar').notEmpty(),
    body('rangkai').notEmpty(),
    body('isyarat').notEmpty(),
    body('intruksi').notEmpty(),
    body('interaksi').notEmpty(),
    body('balok').notEmpty(),
    body('maze').notEmpty(),
    body('puzzle').notEmpty(),
    body('gantian').notEmpty(),
    body('bagi').notEmpty(),
    body('empati').notEmpty(),

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
        jalan: req.body.jalan,
        lompat: req.body.lompat,
        lempar: req.body.lempar,
        gunting: req.body.gunting,
        gambar: req.body.gambar,
        rangkai: req.body.rangkai,
        isyarat: req.body.isyarat,
        interaksi: req.body.interaksi,
        intruksi: req.body.intruksi,
        balok: req.body.balok,
        maze: req.body.maze,
        puzzle: req.body.puzzle,
        gantian: req.body.gantian,
        bagi: req.body.bagi,
        empati: req.body.empati,
    }

    // insert query
    connection.query('INSERT INTO pencapaian SET ?', formData, function (err, rows) {
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
 * SHOW pencapaian
 */
router.get('/(:id)', function (req, res) {

    let id = req.params.id;

    // Modifikasi query untuk memformat bulan dan tahun saja
    connection.query(`SELECT id, fk_anak, DATE_FORMAT(bulan, '%Y-%m-%d') AS bulan, jalan, lompat, lempar, gunting, gambar, rangkai, isyarat, intruksi, interaksi, balok, maze, puzzle, gantian, bagi, empati FROM pencapaian WHERE fk_anak = ${id}`, function (err, rows) {

        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            });
        }

        // if pencapaian not found
        if (rows.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Data pencapaian Not Found!',
            });
        }
        // if pencapaian found
        else {
            return res.status(200).json({
                status: true,
                message: 'Detail Data pencapaian',
                data: rows
            });
        }
    });
});

/**
 * UPDATE pencapaian
 */
router.patch('/update/:id', [

    //validation
    body('fk_anak').notEmpty(),
    body('bulan').notEmpty(),
    body('jalan').notEmpty(),
    body('lompat').notEmpty(),
    body('lempar').notEmpty(),
    body('gunting').notEmpty(),
    body('gambar').notEmpty(),
    body('rangkai').notEmpty(),
    body('isyarat').notEmpty(),
    body('intruksi').notEmpty(),
    body('interaksi').notEmpty(),
    body('balok').notEmpty(),
    body('maze').notEmpty(),
    body('puzzle').notEmpty(),
    body('gantian').notEmpty(),
    body('bagi').notEmpty(),
    body('empati').notEmpty(),

], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //id pencapaian
    let id = req.params.id;

    //data pencapaian
    let formData = {
        fk_anak: req.body.fk_anak,
        bulan: req.body.bulan,
        jalan: req.body.jalan,
        lompat: req.body.lompat,
        lempar: req.body.lempar,
        gunting: req.body.gunting,
        gambar: req.body.gambar,
        rangkai: req.body.rangkai,
        isyarat: req.body.isyarat,
        intruksi: req.body.intruksi,
        interaksi: req.body.interaksi,
        balok: req.body.balok,
        maze: req.body.maze,
        puzzle: req.body.puzzle,
        gantian: req.body.gantian,
        bagi: req.body.bagi,
        empati: req.body.empati,
    }

    // update query
    connection.query(`UPDATE pencapaian SET ? WHERE id = ${id}`, formData, function (err, rows) {
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
 * DELETE pencapaian
 */
router.delete('/delete/(:id)', function(req, res) {

    let id = req.params.id;
     
    connection.query(`DELETE FROM pencapaian WHERE id = ${id}`, function(err, rows) {
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