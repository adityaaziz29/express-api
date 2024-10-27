const express = require('express');
const router = express.Router();

//import express validator
const { body, validationResult } = require('express-validator');

//import database
const connection = require('../config/database');

/**
 * INDEX comment_diskusi
 */
router.get('/', function (req, res) {
    //query
    connection.query('SELECT * FROM comment_diskusi ORDER BY id desc', function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,               
                message: 'List Data comment_diskusis',
                data: rows
            })
        }
    });
});

/**
 * STORE comment_diskusi
 */
 router.post('/store', [

    //validation
    body('fk_user').notEmpty(),
    body('isi').notEmpty(),
    body('fk_diskusi').notEmpty(),

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
        isi: req.body.isi,
        fk_diskusi: req.body.fk_diskusi,
    }

    // insert query
    connection.query('INSERT INTO comment_diskusi SET ?', formData, function (err, rows) {
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
 * SHOW comment_diskusi
 */
router.get('/(:id)', function (req, res) {

    let id = req.params.id;

    connection.query(`SELECT A.id, A.fk_diskusi, A.isi, B.nama, A.tgl_dibuat FROM comment_diskusi A LEFT JOIN user B ON A.fk_user=B.id WHERE A.fk_diskusi = ${id} ORDER BY id desc`, function (err, rows) {

        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        }

        // if comment_diskusi not found
        if (rows.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Data comment_diskusi Not Found!',
            })
        }
        // if comment_diskusi found
        else {
            return res.status(200).json({
                status: true,
                message: 'Detail Data comment_diskusi',
                data: rows
            })
        }
    })
})

/**
 * UPDATE comment_diskusi
 */
router.patch('/update/:id', [

    //validation
  
    body('isi').notEmpty(),
   

], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //id comment_diskusi
    let id = req.params.id;

    //data comment_diskusi
    let formData = {
    
        isi: req.body.isi,
    
    }

    // update query
    connection.query(`UPDATE comment_diskusi SET ? WHERE id = ${id}`, formData, function (err, rows) {
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
 * DELETE comment_diskusi
 */
router.delete('/delete/(:id)', function(req, res) {

    let id = req.params.id;
     
    connection.query(`DELETE FROM comment_diskusi WHERE id = ${id}`, function(err, rows) {
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