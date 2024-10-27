const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const connection = require('../config/database');

/**
 * INDEX pendidikan
 */
router.get('/', function (req, res) {
    //query
    connection.query('SELECT * FROM pendidikan ORDER BY id desc', function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'List Data pendidikan',
                data: rows
            })
        }
    });
});

// Konfigurasi penyimpanan multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/pendidikan'); // Tempat penyimpanan file
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Menambahkan timestamp untuk nama file
    }
});

// Filter untuk menerima hanya file gambar
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
    }
};

// Inisialisasi multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Batas ukuran file 5MB
    fileFilter: fileFilter
});

/**
 * STORE pendidikan
 */
router.post('/store', upload.single('gambar'), [
    // Validasi input
    body('judul').notEmpty(),
    body('deskripsi').notEmpty(),
    body('link').notEmpty(),
], (req, res) => {

    // Cek validasi
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    // Cek apakah ada file yang di-upload
    if (!req.file) {
        return res.status(422).json({
            status: false,
            message: 'Gambar harus di-upload!'
        });
    }

    // Definisikan data form
    let formData = {
        judul: req.body.judul,
        deskripsi: req.body.deskripsi,
        link: req.body.link,
        gambar: req.file.filename, // Simpan nama file hasil upload
    }

    // Query untuk menyimpan data
    connection.query('INSERT INTO pendidikan SET ?', formData, function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            });
        } else {
            return res.status(201).json({
                status: true,
                message: 'Data berhasil disimpan',
                data: rows
            });
        }
    });

});


/**
 * SHOW pendidikan
 */
router.get('/(:id)', function (req, res) {

    let id = req.params.id;

    connection.query(`SELECT * FROM pendidikan WHERE id = ${id}`, function (err, rows) {

        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        }

        // if pendidikan not found
        if (rows.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Data pendidikan Not Found!',
            })
        }
        // if pendidikan found
        else {
            return res.status(200).json({
                status: true,
                message: 'Detail Data pendidikan',
                data: rows[0]
            })
        }
    })
})

/**
 * UPDATE pendidikan
 */
router.patch('/update/:id', [

    //validation
    body('judul').notEmpty(),
    body('deskripsi').notEmpty(),
    body('link').notEmpty(),
    body('gambar').notEmpty(),

], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //id pendidikan
    let id = req.params.id;

    //data pendidikan
    let formData = {
        judul: req.body.judul,
        deskripsi: req.body.deskripsi,
        link: req.body.link,
        gambar: req.body.gambar,
    }

    // update query
    connection.query(`UPDATE pendidikan SET ? WHERE id = ${id}`, formData, function (err, rows) {
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
 * DELETE pendidikan
 */
router.delete('/delete/(:id)', function(req, res) {

    let id = req.params.id;
     
    connection.query(`DELETE FROM pendidikan WHERE id = ${id}`, function(err, rows) {
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