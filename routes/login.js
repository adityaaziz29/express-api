const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); // Pastikan ini ada
const connection = require('../config/database');

/**
 * LOGIN USER
 */
router.post('/', [
    // Validasi input
    body('email').notEmpty().withMessage('Email is required'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    const { email, password } = req.body;

     // Tambahkan logging di sini
     console.log('Received email:', email);
     console.log('Received password:', password);

    // Query untuk mendapatkan user berdasarkan email
    connection.query('SELECT * FROM user WHERE email = ?', [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(403).json({
                message: 'Invalid email or password'
            }); // Return error message if user not found
        }

        const user = results[0];

        // Memeriksa password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(403).json({
                message: 'Invalid email or password'
            }); // Return error message if password does not match
        }

        // Jika berhasil, buat token
        const token = jwt.sign({ email: user.email }, 'secret_key', { expiresIn: '1h' });

        // Mengembalikan token dan data user dalam respons JSON
        res.json({
            token: token,
            user: {
                id: user.id,
                nama: user.nama,
                email: user.email,
                role: user.role
            },
            message: 'Login successful'
        });
    });
});

module.exports = router;
