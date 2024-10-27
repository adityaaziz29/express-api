const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs'); // Import bcrypt
const connection = require('../config/database');

/**
 * INDEX User
 */
router.get('/', function (req, res) {
    connection.query('SELECT * FROM user ORDER BY id desc', function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'List Data Users',
                data: rows
            });
        }
    });
});

/**
 * STORE User
 */
router.post('/store', [
    body('nama').notEmpty(),
    body('email').notEmpty(),
    body('no_wa').notEmpty(),
    body('alamat').notEmpty(),
    body('no_ktp').notEmpty(),
    body('password').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    let formData = {
        nama: req.body.nama,
        email: req.body.email,
        password: hashedPassword, // Simpan hashed password
        no_wa: req.body.no_wa,
        alamat: req.body.alamat,
        no_ktp: req.body.no_ktp,
    };

    connection.query('INSERT INTO user SET ?', formData, function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            });
        } else {
            return res.status(201).json({
                status: true,
                message: 'Insert Data Successfully',
                data: rows[0]
            });
        }
    });
});

/**
 * SHOW USER
 */
router.get('/:id', function (req, res) {
    let id = req.params.id;

    connection.query(`SELECT * FROM user WHERE id = ?`, [id], function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            });
        }

        if (rows.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Data User Not Found!',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Detail Data User',
                data: rows[0]
            });
        }
    });
});

/**
 * UPDATE USER
 */
router.patch('/update/:id', [
    body('nama').notEmpty(),
    body('email').notEmpty(),
    body('no_wa').notEmpty(),
    body('alamat').notEmpty(),
    body('no_ktp').notEmpty(),
    body('password').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    let id = req.params.id;

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    let formData = {
        nama: req.body.nama,
        email: req.body.email,
        password: hashedPassword, // Simpan hashed password
        no_wa: req.body.no_wa,
        alamat: req.body.alamat,
        no_ktp: req.body.no_ktp,
    };

    connection.query(`UPDATE user SET ? WHERE id = ?`, [formData, id], function (err) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Update Data Successfully!'
            });
        }
    });
});

/**
 * DELETE USER
 */
router.delete('/delete/:id', function(req, res) {
    let id = req.params.id;

    connection.query(`DELETE FROM user WHERE id = ?`, [id], function(err) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Delete Data Successfully!',
            });
        }
    });
});

module.exports = router;
