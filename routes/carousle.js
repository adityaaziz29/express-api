const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const connection = require('../config/database');

/**
 * INDEX carousle
 */
router.get('/', function (req, res) {
    //query
    connection.query('SELECT * FROM carousle ORDER BY id asc', function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'List Data carousles',
                data: rows
            })
        }
    });
});

// Konfigurasi multer untuk menyimpan file gambar
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/carousle'); // folder tempat penyimpanan file gambar
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // menambahkan timestamp pada nama file
    }
});

// Inisialisasi multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // batas ukuran file 5MB
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Hanya gambar dengan format .jpeg, .jpg, dan .png yang diperbolehkan!'));
        }
    }
});



/**
 * STORE carousle
 */
 /**
 * STORE carousle dengan upload gambar
 */
router.post('/store', upload.single('foto'), [

    //validation
    body('link').notEmpty(),

], (req, res) => {

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
            message: 'Foto harus di-upload!'
        });
    }

    //define formData
    let formData = {
        link: req.body.link,
        foto: req.file.filename // menyimpan nama file gambar
    }

    // insert query
    connection.query('INSERT INTO carousle SET ?', formData, function (err, rows) {
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
 * SHOW carousle
 */
router.get('/(:id)', function (req, res) {

    let id = req.params.id;

    connection.query(`SELECT * FROM carousle WHERE id = ${id}`, function (err, rows) {

        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        }

        // if carousle not found
        if (rows.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Data carousle Not Found!',
            })
        }
        // if carousle found
        else {
            return res.status(200).json({
                status: true,
                message: 'Detail Data carousle',
                data: rows[0]
            })
        }
    })
})

/**
 * UPDATE carousle
 */
router.patch('/update/:id', [

    //validation
    body('link').notEmpty(),


], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //id carousle
    let id = req.params.id;

    //data carousle
    let formData = {
      
        link: req.body.link,
       
    }

    // update query
    connection.query(`UPDATE carousle SET ? WHERE id = ${id}`, formData, function (err, rows) {
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
 * DELETE carousle
 */
router.delete('/delete/(:id)', function(req, res) {

    let id = req.params.id;
     
    connection.query(`DELETE FROM carousle WHERE id = ${id}`, function(err, rows) {
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