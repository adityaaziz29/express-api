const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
const bodyParser = require('body-parser')

const authenticateToken = require('./middleware/authenticateToken'); 

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/uploads', express.static('uploads'));

const loginRouter = require('./routes/login'); 
app.use('/api/login', loginRouter);

// Contoh route lain yang dilindungi
app.use('/api/protected-route', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

//import route posts
const postsRouter = require('./routes/posts');
app.use('/api/posts', postsRouter); // use user posts di Express

//import route User
const userRouter = require('./routes/user');
app.use('/api/user', userRouter); // use route user di Express

//import route tutorial
const tutorialRouter = require('./routes/tutorial');
app.use('/api/tutorial', tutorialRouter); // use route tutorial di Express

//import route pendidikan
const pendidikanRouter = require('./routes/pendidikan');
app.use('/api/pendidikan', pendidikanRouter); // use route pendidikan di Express

//import route perkembangan
const growthRouter = require('./routes/growth');
app.use('/api/growth', growthRouter); // use route perkembangan di Express

//import route pencapaian
const pencapaianRouter = require('./routes/pencapaian');
app.use('/api/pencapaian', pencapaianRouter); // use route pencapaian di Express

//import route group wa
const whatsappRouter = require('./routes/whatsapp');
app.use('/api/whatsapp', whatsappRouter); // use route group wa di Express

//import route fasilitas
const fasilitasRouter = require('./routes/fasilitas');
app.use('/api/fasilitas', fasilitasRouter); // use route fasilitas di Express

//import route article
const articleRouter = require('./routes/article');
app.use('/api/article', articleRouter); // use route article di Express

//import route carousle
const carousleRouter = require('./routes/carousle');
app.use('/api/carousle', carousleRouter); // use route carousle di Express

//import route anak
const anakRouter = require('./routes/anak');
app.use('/api/anak', anakRouter); // use route anak di Express

//import route aktivitas
const aktivitasRouter = require('./routes/aktivitas');
app.use('/api/aktivitas', aktivitasRouter); // use route aktivitas di Express

//import route diskusi
const diskusiRouter = require('./routes/diskusi');
app.use('/api/diskusi', diskusiRouter); // use route diskusi di Express

//import route komunitas
const komunitasRouter = require('./routes/komunitas');
app.use('/api/komunitas', komunitasRouter); // use route komunitas di Express

//import route comment
const commentRouter = require('./routes/comment');
app.use('/api/comment', commentRouter); // use route comment di Express

app.listen(port, () => {
  console.log(`app running at http://localhost:${port}`)
})