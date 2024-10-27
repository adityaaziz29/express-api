const express = require('express');
const router = express.Router();
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const connection = require('../config/database');

// Konfigurasi multer untuk menyimpan file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Pastikan folder ini ada atau buat folder uploads
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Menggunakan timestamp untuk nama file
    }
});

const upload = multer({ storage: storage });

/**
 * INDEX anak
 */
router.get('/', function (req, res) {
    connection.query('SELECT * FROM anak ORDER BY id desc', function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'List Data anaks',
                data: rows
            });
        }
    });
});

/**
 * STORE anak
 */
router.post('/store', upload.single('foto'), [
    // validation
    body('fk_user').notEmpty(),
    body('nama').notEmpty(),
    body('usia').notEmpty(),
    body('jenis_kelamin').notEmpty(),
], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    // Define formData
    let formData = {
        fk_user: req.body.fk_user,
        nama: req.body.nama,
        usia: req.body.usia,
        jenis_kelamin: req.body.jenis_kelamin,
        foto: req.file ? req.file.path : null, // Menyimpan path foto jika ada
    };

    // Insert query
    connection.query('INSERT INTO anak SET ?', formData, function (err, result) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            });
        } else {
            return res.status(201).json({
                status: true,
                message: 'Insert Data Successfully',
                data: {
                    id: result.insertId, // Mengembalikan ID yang baru saja disisipkan
                    ...formData
                }
            });
        }
    });
});

/**
 * SHOW anak
 */
router.get('/:id', function (req, res) {
    let id = req.params.id;

    connection.query(`SELECT * FROM anak WHERE fk_user = ${id} ORDER BY id desc`, function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            });
        }

        if (rows.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Data anak Not Found!',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Detail Data anak',
                data: rows
            });
        }
    });
});

/**
 * UPDATE anak
 */
router.patch('/update/:id', upload.single('foto'), [
    // validation
    body('fk_user').notEmpty(),
    body('nama').notEmpty(),
    body('usia').notEmpty(),
    body('jenis_kelamin').notEmpty(),
], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    let id = req.params.id;

    let formData = {
        fk_user: req.body.fk_user,
        nama: req.body.nama,
        usia: req.body.usia,
        jenis_kelamin: req.body.jenis_kelamin,
        foto: req.file ? req.file.path : null, // Menyimpan path foto jika ada
    };

    // Update query
    connection.query(`UPDATE anak SET ? WHERE id = ${id}`, formData, function (err, result) {
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
 * DELETE anak
 */
router.delete('/delete/:id', function (req, res) {
    let id = req.params.id;

    connection.query(`DELETE FROM anak WHERE id = ${id}`, function (err, rows) {
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
